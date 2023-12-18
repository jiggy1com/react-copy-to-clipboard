import clientPromise from "@/lib/mongodb";
import {hashPassword} from "@/services/StringHelpers";

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
            title: title,
            userId: this.userId
        })
    }

    getNewBoardItem(text=''){
        return Object.assign(BOARD_ITEM,{
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
                    boardRecord = {_id: boardRecord.insertedId, ...boardData};
                    boardRecord.list.push(boardItem.insertedId)
                    console.log('boardRecord', boardRecord);
                    let update = {
                        $set: {
                            list: boardRecord.list
                        }
                    }
                    return db.collection('boards').updateOne({_id: boardRecord._id}, update).then((updatedBoard)=>{
                        return this.getBoardsByUserId(this.userId).then((boards)=>{
                            return boards;
                        });
                    })
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

    readBoard() {
        return this.connect().then((db) => {
            return db.collection('test')
                .find({})
                .toArray()
        });
    }

    updateBoard() {

    }

    deleteBoard() {

    }

    // board item crud
    createBoardItem(item=null) {
        let boardItem = this.getNewBoardItem(item)
        return this.connect().then((db)=>{
            return db.collection('boardItem').insertOne(boardItem);
        })
    }

    readBoardItem() {

    }

    updateBoardItem() {

    }

    deleteBoardItem() {

    }

}
