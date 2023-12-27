import clientPromise from "@/lib/mongodb";
import {hashPassword} from "@/services/StringHelpers";
import {ObjectId} from "mongodb";
import {
    generateRandomTitle,
    MONGODB_COLLECTION_BOARD_ITEM,
    MONGODB_COLLECTION_BOARDS,
    MONGODB_DATABASE
} from "@/services/AppService";

// TODO: move BOARD and BOARD_ITEM to AppService, same for CopyPasteService
const BOARD = {
    // _id,
    order: 0,
    title: '',
    list: [],
    userId: null,
}

const BOARD_ITEM = {
    // _id,
    order: 0,
    type: 'text',
    text: '',
    userId: null
}

export class MongoDBService {

    constructor(userId) {
        this.databaseName = MONGODB_DATABASE;
        this.userId = null;
    }

    setUserId(userId){
        this.userId = userId;
        return this;
    }

    // basic
    async connect() {
        const client = await clientPromise;
        return client.db(this.databaseName);
    }

    // helpers
    convertObjectIdToString(arrOrObject){
        if(Array.isArray((arrOrObject))){
            arrOrObject.forEach((obj, idx)=>{
                obj._id = obj._id.toString()
            })
            return arrOrObject
        }else{
            arrOrObject._id = arrOrObject._id.toString()
            return arrOrObject;
        }
    }

    // advanced
    query() {

    }

    // authentication

    // create account
    createAccount({email, password, salt, localStorage}){
        let userId = null;
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    email: email,
                }
                db.collection('users').findOne(query).then((doc)=>{
                    if(doc){
                        reject({
                            message: 'User already exists'
                        })
                    }else{
                        db.collection('users').insertOne({email, password, salt}).then((doc)=>{
                            this.setUserId(doc.insertedId.toString())
                            if(Array.isArray(localStorage)){
                                this.loopLocalStorage(localStorage).then(()=>{

                                })
                            }
                            resolve({
                                userId: this.userId
                            })
                        })
                    }
                })
            })
        })
    }

    async loopLocalStorage(localStorage){
        for(let i=0; i<localStorage.length; i++){
            await this.handleLocalStorageBoard(localStorage[i], i).then((res)=>{

            })
        }
    }

    handleLocalStorageBoard(board, boardIdx){
        return new Promise((resolve, reject)=>{
            let boardData = {
                userId: this.userId,
                title: board.title,
                order: boardIdx,
                list: []
            }
            this.connect().then((db)=>{
                db.collection(MONGODB_COLLECTION_BOARDS).insertOne(boardData).then((newBoard)=>{
                    this.loopLocalStorageBoardItems({newBoard, boardItems: board.list}).then((res)=>{
                        resolve()
                    })
                })
            })
        })
    }

    async loopLocalStorageBoardItems({newBoard, boardItems}){
        for(let i=0; i<boardItems.length; i++){
            let data = {
                newBoard,
                boardItem: boardItems[i],
                boardItemIdx: i,
            }
            await this.handleLocalStorageBoardItem(data).then((res)=>{

            })
        }
    }

    handleLocalStorageBoardItem({newBoard, boardItem, boardItemIdx}){
        return new Promise((resolve, reject)=>{
            let boardItemData = {
                _id: newBoard.insertedId,
                userId: this.userId,
                text: boardItem.text,
                type: boardItem.type,
                order: boardItemIdx
            }
            this.addBoardItemToBoard(boardItemData).then((newBoardItem)=>{
                resolve()
            })
        })
    }

    signin(payload){

        let query = {
            email: payload.email,
        }

        let options ={
            projection: {

                email: 1,
            }
        }

        return this.connect().then((db)=>{
            return db.collection('users').findOne(query).then((resp)=>{
                if(resp){
                    let oPasswordHash = hashPassword(payload.password, resp.salt);
                    query.password = oPasswordHash.passwordHash;
                    return db.collection('users')
                        .findOne(query, options)
                        .then((resp)=>{
                        return this.convertObjectIdToString(resp);
                    })
                }else{
                    return null
                }
            });
        })
    }

    // helpers
    getNewBoard(){
        return Object.assign(BOARD, {
            _id: new ObjectId(),
            order: 0,
            title: generateRandomTitle(),
            userId: this.userId,
            list: []
        })
    }

    getNewBoardItem(text='', order = 0, type='text'){
        return Object.assign(BOARD_ITEM,{
            _id: new ObjectId(),
            order: order,
            userId: this.userId,
            text: text,
            type: type,
        })
    }

    // board crud
    createBoard() {
        return new Promise((resolve, reject)=>{
            this.createBoardItem().then((boardItem)=>{
                this.connect().then((db)=>{
                    let query = {
                        userId: this.userId
                    }
                    db.collection(MONGODB_COLLECTION_BOARDS).find(query).toArray().then((boards)=>{
                        let boardData = this.getNewBoard();
                        boardData.order = boards.length;
                        db.collection(MONGODB_COLLECTION_BOARDS).insertOne(boardData).then((boardRecord)=> {
                            console.log('boardRecord', boardRecord);
                            let query = {
                                _id: new ObjectId(boardRecord.insertedId)
                            }
                            let update = {
                                $push: {
                                    list: boardItem.insertedId
                                }
                            }
                            let options = {
                                returnNewDocument: true
                            }
                            db.collection(MONGODB_COLLECTION_BOARDS).findOneAndUpdate(query, update, options).then((doc)=>{
                                this.getBoardsByUserId(this.userId).then((boards)=>{
                                    resolve(boards)
                                })
                            })
                        })
                    })
                })
            });
        })
    }

    getBoardsByUserId(userId){
        return this.connect().then((db)=>{
            return db.collection(MONGODB_COLLECTION_BOARDS).aggregate([
                {
                    $match: {
                        userId: userId,
                    },
                },
                {
                    $unwind: {
                        path: '$list'
                    }
                },
                {
                    $lookup: {
                        from: MONGODB_COLLECTION_BOARD_ITEM,
                        localField: 'list',
                        foreignField: '_id',
                        as: 'list',
                    }
                },
                {
                    $unwind: '$list'
                },
                {
                    $group: {
                        _id: "$_id",
                        userId: {$first:"$userId"},
                        title: {"$first": "$title"},
                        order: {"$first": "$order"},
                        list: {
                            $push: "$list"
                        }
                    }
                },
                {
                    $project:{
                        _id: 1,
                        userId: 1,
                        title: 1,
                        order: 1,
                        list: 1,
                    }
                },
                {
                    $sort: {
                        order: 1
                    }
                },
            ]).toArray()
        })
    }

    getBoardByUserId({_id}){
        let foundBoard = null;
        return new Promise((resolve, reject)=>{
            this.getBoardsByUserId(this.userId).then((boards)=>{
                boards.forEach((board)=>{
                    if(board._id.toString() === _id){
                        foundBoard = board;
                    }
                })
                if(foundBoard){
                    resolve(foundBoard)
                }else{
                    reject(foundBoard)
                }
            }).catch((err)=>{
                resolve(err)
            })
        })
    }

    // readBoardById(_id) {
    //     let query = {
    //         _id: _id,
    //         userId: this.userId,
    //     }
    //     return this.connect().then((db) => {
    //         return db.collection(MONGODB_COLLECTION_BOARDS)
    //             .find(query)
    //             .toArray()
    //     });
    // }

    updateBoard({boardId, userId, newValue}) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(boardId),
                    userId
                };
                let update = {
                    $set: {
                        title: newValue
                    }
                }
                let options = {
                    returnDocument: 'after'
                }
                db.collection(MONGODB_COLLECTION_BOARDS).findOneAndUpdate(query, update, options).then((doc)=>{
                    console.log('updateBoard:doc', doc);
                    resolve(doc);
                }).catch((err)=>{
                    reject(err);
                })
            })
        })
    }

    deleteBoard({boardId, userId}) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(boardId),
                    userId: userId
                }
                let options = {

                }
                db.collection(MONGODB_COLLECTION_BOARDS).findOneAndDelete(query, options).then((doc)=>{
                    console.log('deleteBoard:doc', doc);
                    resolve();
                })
            })
        })
    }

    // board item crud
    // TODO: find usages, and repair
    createBoardItem() {
        let boardItem = this.getNewBoardItem(generateRandomTitle(), 0)
        return this.connect().then((db)=>{
            return db.collection(MONGODB_COLLECTION_BOARD_ITEM).insertOne(boardItem);
        })
    }

    addBoardItemToBoard({_id, text, type='text', order=null|0}){
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(_id),
                    userId: this.userId,
                }
                db.collection(MONGODB_COLLECTION_BOARDS).find(query).toArray().then((board) => {
                    let boardItemData = this.getNewBoardItem(text);
                    boardItemData.order = order ?? board[0].list.length;
                    boardItemData.type = type;
                    console.log('boardItemDataObject', boardItemData)
                    let options = {}
                    db.collection(MONGODB_COLLECTION_BOARD_ITEM).insertOne(boardItemData).then((boardItem)=>{

                        console.log('boardItemDataActuallyInserted', boardItem);

                        let query = {
                            _id: new ObjectId(_id),
                        }
                        let update = {
                            $push: {
                                list: boardItem.insertedId
                            }
                        }
                        let options = {
                            returnDocument: 'after',
                            returnNewDocument: true
                        }

                        db.collection(MONGODB_COLLECTION_BOARDS).findOneAndUpdate(query, update, options).then((doc)=>{
                            console.log('addBoardToItem:doc', doc)
                            resolve(doc)
                        })

                    })
                })
            })
        })
    }

    readBoardItem() {

    }

    updateBoardItem({boardItemId, newValue}) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(boardItemId)
                }
                let update = {
                    $set: {
                        text: newValue
                    }
                }
                let options = {
                    returnNewDocument: true
                }
                db.collection(MONGODB_COLLECTION_BOARD_ITEM).findOneAndUpdate(query, update, options).then((doc)=>{
                    console.log('updateBoardItem:doc', doc);
                    resolve(doc);
                })
            })
        })
    }

    deleteBoardItem({boardId, boardItemId}) {
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(boardItemId),
                    userId: this.userId
                }
                // delete board item
                db.collection(MONGODB_COLLECTION_BOARD_ITEM).deleteOne(query).then((result)=>{
                    console.log('deleteBoardItem:result', result);

                    // find board and pull board item
                    let query = {
                        _id: new ObjectId(boardId),
                        userId: this.userId
                    }
                    let update = {
                        $pull: {
                            list: new ObjectId(boardItemId)
                        }
                    }
                    let options = {
                        returnDocument: 'after',
                    }
                    db.collection(MONGODB_COLLECTION_BOARDS).findOneAndUpdate(query, update, options).then((doc)=>{
                        console.log('deleteBoardItem:doc', doc);
                        resolve(doc);
                    })
                })
            })
        })
    }

    swapBoard({userId, fromBoardId, toBoardId, fromBoardIdx, toBoardIdx}){
        let query = {userId}
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let Boards = db.collection(MONGODB_COLLECTION_BOARDS);
                Boards.find(query).toArray().then((boards)=>{

                }).then(()=>{
                    this.getBoardsByUserId(userId).then((boards)=>{
                        boards.forEach((board, idx)=> {
                            let order = idx;
                            console.log('order', order, board._id, fromBoardId)
                            if(board._id.toString() === fromBoardId){
                                console.log('override:order:1:', toBoardIdx)
                                order = parseInt(toBoardIdx)
                            }
                            if(board._id.toString() === toBoardId){
                                console.log('override:order:2:', fromBoardIdx)
                                order = parseInt(fromBoardIdx)
                            }
                            let query = {_id: board._id}
                            let update = {
                                $set: {
                                    order: order
                                }
                            }
                            let options = {
                                returnDocument: 'after'
                            }
                            Boards.findOneAndUpdate(query, update, options).then((updatedDoc)=>{
                                console.log('updatedDoc', updatedDoc)
                                resolve()
                            })
                        })

                    })

                })
            })
        })
    }

    swapBoardItem({userId, boardId, fromId, toId, fromIdx, toIdx}){
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    userId,
                    _id: new ObjectId(boardId)
                }
                db.collection(MONGODB_COLLECTION_BOARDS).findOne(query).then((doc)=>{
                    console.log('doc', doc);

                    let list = doc.list;
                    let from = list[fromIdx]
                    let to = list[toIdx]
                    list[toIdx] = from;
                    list[fromIdx] = to;

                    let update = {
                        $set: {
                            list: list
                        }
                    }
                    let options = {
                        returnDocument: 'after'
                    }

                    db.collection(MONGODB_COLLECTION_BOARDS).findOneAndUpdate(query, update, options).then((doc)=>{
                        console.log('updated:doc', doc);
                        resolve(doc)
                    })


                })

            })
        })
    }

    toggleBoardItem({boardId, boardItemId, newType}){
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                let query = {
                    _id: new ObjectId(boardItemId),
                    userId: this.userId,
                }
                let update = {
                    $set: {
                        type: newType
                    }
                }
                let options = {
                    returnDocument: 'after'
                }
                db.collection(MONGODB_COLLECTION_BOARD_ITEM).findOneAndUpdate(query, update, options).then((doc)=>{
                    resolve(doc);
                }).catch((err)=>{
                    reject(err)
                })
            })
        })
    }


}
