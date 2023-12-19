import clientPromise from "@/lib/mongodb";
import {hashPassword} from "@/services/StringHelpers";
import {ObjectId} from "mongodb";

// TODO: rename boards to board
// const BOARDS = 'boards';
// const BOARD_ITEM = 'boardItem';

const BOARD = {
    order: 0,
    title: '',
    list: []
}

const BOARD_ITEM = {
    type: 'text',
    text: ''
}



export class MongoDBService {

    constructor(userId) {
        this.databaseName = 'clipboardmanager';
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
    createAccount(data){
        return this.connect().then((db)=>{
           return db.collection('users').insertOne(data);
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
    getNewBoard(title=''){
        return Object.assign(BOARD, {
            _id: new ObjectId(),
            title: title,
            userId: this.userId,
            list: []
        })
    }

    getNewBoardItem(text=''){
        return Object.assign(BOARD_ITEM,{
            _id: new ObjectId(),
            userId: this.userId,
            text: text
        })
    }

    // board crud
    createBoard(title = 'Board Name') {
        return this.createBoardItem('Board Item').then((boardItem)=>{
            return this.connect().then((db)=>{
                let boardData = this.getNewBoard(title)
                return db.collection('boards').insertOne(boardData).then((boardRecord)=>{
                    // boardRecord = {_id: boardRecord.insertedId, ...boardData};
                    // boardRecord.list.push(boardItem.insertedId)
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
                    return db.collection('boards').findOneAndUpdate(query, update, options).then((doc)=>{
                        return this.getBoardsByUserId(this.userId).then((boards)=>{
                            return boards;
                        })
                    })
                    // return db.collection('boards').updateOne({_id: boardRecord._id}, update).then((updatedBoard)=>{
                    //     return this.getBoardsByUserId(this.userId).then((boards)=>{
                    //         return boards;
                    //     });
                    // })
                })
            })
        });
    }

    getBoardsByUserId(userId){
        return this.connect().then((db)=>{
            return db.collection('boards').aggregate([
                {
                    $match: {
                        userId: userId,
                    },
                },
                {
                    $sort: {
                        order: 1
                    }
                },
                {
                    $lookup: {
                        from: 'boardItem',
                        localField: 'list',
                        foreignField: '_id',
                        as: 'list'
                    }
                }
            ]).toArray()
        })
    }

    readBoardById(_id) {
        let query = {
            _id: _id,
            userId: this.userId,
        }
        return this.connect().then((db) => {
            return db.collection('boards')
                .find(query)
                .toArray()
        });
    }

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
                db.collection('boards').findOneAndUpdate(query, update, options).then((doc)=>{
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
                db.collection('boards').findOneAndDelete(query, options).then((doc)=>{
                    console.log('deleteBoard:doc', doc);
                    resolve();
                })
            })
        })
    }

    // board item crud
    // TODO: find usages, and repair
    createBoardItem({item = ''}) {
        let boardItem = this.getNewBoardItem(item)
        return this.connect().then((db)=>{
            return db.collection('boardItem').insertOne(boardItem);
        })
    }

    addBoardItemToBoard({_id, text}){
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{

                let boardItem = this.getNewBoardItem(text);
                let options = {

                }
                console.log('boardItem', boardItem);
                db.collection('boardItem').insertOne(boardItem).then((boardItem)=>{

                    let query = {
                        _id: new ObjectId(_id),
                    }
                    let update = {
                        $push: {
                            list: boardItem.insertedId
                        }
                    }
                    let options = {
                        returnNewDocument: true
                    }

                    db.collection('boards').findOneAndUpdate(query, update, options).then((doc)=>{
                        console.log('addBoardToItem:doc', doc)
                        resolve(doc)
                        // return doc;
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
                db.collection('boardItem').findOneAndUpdate(query, update, options).then((doc)=>{
                    console.log('doc', doc);
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
                db.collection('boardItem').deleteOne(query).then((result)=>{
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
                    db.collection('boards').findOneAndUpdate(query, update, options).then((doc)=>{
                        console.log('deleteBoardItem:doc', doc);
                        resolve(doc);
                    })
                })
            })
        })
    }


}
