import {FetchService} from "@/services/FetchService";
import {generateRandomTitle, getRandomInt} from "@/services/AppService";

// TODO: move BOARD and BOARD_ITEM to AppService, same for CopyPasteService


const LOCAL_STORAGE_KEY = 'cp';

const BOARD_ITEM_LIST = [
    // BOARD_ITEM
];
const BOARD_ITEM = {
    // _id: '',
    userId: null,
    order: 0,
    text: '',
    type: 'text', // types include: text, password
}

const BOARDS = [];
const BOARD = {
    // _id: '',
    userId: null,
    order: 0,
    title: '',
    list: BOARD_ITEM_LIST
}

export class CopyPasteService {

    constructor(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.boards = [] //this.getBoards();
        this.createDispatcher();
    }

    // temporary fix
    runTempFix(){
        console.log('runTempFix')
        let doSave = false;
        let boards = this.getBoardsByLocalStorage();
        boards.forEach((board, boardIdx)=>{
            if(typeof board._id === 'undefined'){
                doSave = true
                board._id = getRandomInt()
                board.order = boardIdx
            }
            board.list.forEach((listItem, listItemIdx)=>{
                if(typeof listItem !== 'object'){
                    console.log('should be setting', listItemIdx, 'to', listItem)
                    doSave = true;
                    boards[boardIdx].list[listItemIdx] = {
                        _id: getRandomInt(),
                        order: listItemIdx,
                        type: 'text',
                        text: listItem
                    }
                }
            })
        });
        if(doSave){
            this.setBoards(boards);
        }
    }


    //

    createDispatcher() {

        // server side, bail early
        if (typeof window === 'undefined') {
            return
        }

        if (!CopyPasteService.prototype.dispatcher) {
            CopyPasteService.prototype.dispatcher = this.createElement()
        }
    }

    createElement() {
        let d = document.createElement('div')
        d.setAttribute('id', Math.random())
        return d;
    }

    dispatch(eventType = 'reload') {
        let event = new CustomEvent(eventType);
        this.dispatcher.dispatchEvent(event);
        CopyPasteService.prototype.dispatcher.dispatchEvent(event);
    }

    dispatchForceReload() {
        console.log('dispatchForceReload called')
        this.dispatch('forceReload');
    }

    // local storage methods

    getBoards() {
        return new Promise((resolve, reject)=>{
            if (typeof window !== 'undefined') {
                if(this.isLoggedIn){
                    this.getBoardsByUserId().then((resp)=>{
                        resolve(resp);
                    })
                }else{
                    resolve(this.getBoardsByLocalStorage());
                }
            } else {
                resolve(BOARDS);
            }
        })
    }

    getBoardsByUserId(){
        let f = new FetchService()
        let url = '/api/boardsByUserId'
        return f.doGet(url).then((res)=>{
            return res.data
        })
    }

    getBoardsByLocalStorage(){
        let boards = localStorage.getItem(LOCAL_STORAGE_KEY)
        return boards
            ? JSON.parse(boards)
            : BOARDS;
    }

    setBoards(what) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(what));
        this.dispatch();
    }

    clearAllBoards() {
        localStorage.setItem(LOCAL_STORAGE_KEY, '');
    }

    // boards crud

    createBoard(title = '') {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                let f = new FetchService();
                let url = '/api/createboard';
                let data = {};
                f.doPost(url, data).then((resp)=>{
                    resolve(resp);
                })
            }else{
                this.createBoardLocalStorage().then((boards)=>{
                    resolve({
                        success: true,
                        message: '',
                        data: boards
                    });
                })
            }
        })

    }

    createBoardLocalStorage(){

        // generate board item
        let board = Object.assign(BOARD, {
            _id: getRandomInt(),
            order: 0,
            title: generateRandomTitle(),
            list: [
                Object.assign(BOARD_ITEM,{
                    _id: getRandomInt(),
                    order: 0,
                    text: generateRandomTitle()
                })
            ]
        });

        // get and append boards
        return this.getBoards().then((boards)=>{
            boards.push(board);
            // write to local storage
            this.setBoards(boards);
            return boards;
        });
    }

    // readBoard(idx) {
    //     return this.getBoards().then((boards)=>{
    //         return boards[idx]
    //     });
    // }

    updateBoard({boardId, boardIdx, newValue}) {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.updateBoardMongoDb({boardId, newValue}).then(()=>{
                    resolve()
                })
            }else{
                this.updateBoardLocalStorage({boardIdx, newValue})
                resolve()
            }
        })
    }

    updateBoardMongoDb({boardId, newValue}){
        let f = new FetchService()
        let url = '/api/updateBoard';
        let data = {boardId, newValue}
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    updateBoardLocalStorage({boardIdx, newValue}){
        this.getBoards().then((boards)=>{
            boards[boardIdx].title = newValue;
            this.setBoards(boards);
        })
    }

    deleteBoard({boardId, boardIdx}) {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.deleteBoardMongoDb({boardId}).then(()=>{
                    resolve()
                })
            }else{
                this.deleteBoardLocalStorage({boardIdx});
            }
        })
    }

    deleteBoardMongoDb({boardId}){
        let f = new FetchService();
        let url = '/api/deleteBoard';
        let data = {boardId}
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    deleteBoardLocalStorage({boardIdx}){
         this.getBoards().then((boards)=>{
             boards.splice(boardIdx, 1)
             this.setBoards(boards);
             this.dispatchForceReload();
         })
    }

    // lists crud

    createBoardItem({text, boardIdx, boardId}) {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.createBoardItemMongoDB({text, boardId}).then((doc)=>{
                    console.log('createBoardItem:doc', doc);
                    resolve(doc);
                });
            }else{
                this.createBoardItemLocalStorage({text, boardIdx}).then((boardItem)=>{
                    resolve({
                        success: true,
                        message: '',
                        data: [boardItem]
                    })
                })
            }
        })
    }

    createBoardItemMongoDB({item, boardId}){
        let f = new FetchService();
        let url = '/api/createBoardItem'
        let data = {
            item: item,
            _id: boardId,
        }
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    createBoardItemLocalStorage({text, boardIdx}){
        let boardItem = Object.assign(BOARD_ITEM, {
            _id: getRandomInt(),
            order: this.getBoardsByLocalStorage()[boardIdx].list.length,
            text: text
        })
        return this.getBoards().then((boards)=>{
            boards[boardIdx].list.push(boardItem);
            this.setBoards(boards);
            return boardItem
        });
    }

    // readList() {
    //
    // }

    updateBoardItem({boardId, boardItemId, boardIdx, boardItemIdx, newValue}) {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.updateBoardItemMongoDb({boardItemId, newValue}).then((res)=>{
                    resolve(res);
                })
            }else{
                this.updateBoardItemLocalStorage({boardIdx, boardItemIdx, newValue}).then((res)=>{
                    resolve(res);
                })
            }
        })
    }

    updateBoardItemMongoDb({boardItemId, newValue}){
        let f = new FetchService();
        let url = '/api/updateBoardItem'
        let data = {
            boardItemId,
            newValue,
        }
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    updateBoardItemLocalStorage({boardIdx, boardItemIdx, newValue}){
        let boardItem = Object.assign(BOARD_ITEM, {
            text: newValue
        })
        return new Promise((resolve, reject)=>{
            this.getBoards().then((boards)=>{
                boards[boardIdx].list[boardItemIdx] = boardItem;
                this.setBoards(boards);
                resolve({
                    success: true,
                    message: '',
                    data: [boardItem]
                })
            });
        })
    }

    deleteBoardItem({boardId, boardItemId, boardIdx, boardItemIdx}) {
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.deleteBoardItemMongoDb({boardId, boardItemId}).then(()=>{
                    resolve()
                })
            }else{
                this.deleteBoardItemLocalStorage({boardIdx, boardItemIdx})
                resolve()
            }
        })
    }

    deleteBoardItemMongoDb({boardId, boardItemId}){
        let f = new FetchService()
        let url = '/api/deleteBoardItem'
        let data = {
            boardId,
            boardItemId
        }
        return f.doPost(url, data).then((res)=>{
            return res;
        });
    }

    deleteBoardItemLocalStorage({boardIdx, boardItemIdx}){
        let boards = this.getBoards().then((boards)=>{
            boards[boardIdx].list.splice(boardItemIdx, 1);
            this.setBoards(boards);
            this.dispatchForceReload();
        });
    }

    // additional methods

    swapBoard({fromBoardIdx, toBoardIdx, fromBoardId, toBoardId}){
        console.log('swapBoard')
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.swapBoardMongoDb({fromBoardIdx, toBoardIdx, fromBoardId, toBoardId}).then(()=>{
                    resolve()
                })
            }else{
                this.swapBoardLocalStorage({fromBoardIdx, toBoardIdx})
                resolve()
            }
        })
    }

    swapBoardMongoDb({fromBoardIdx, toBoardIdx, fromBoardId, toBoardId}){
        let f = new FetchService();
        let url = '/api/swapBoard'
        let data = {fromBoardIdx, toBoardIdx, fromBoardId, toBoardId}
        console.log('data', data)
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    swapBoardLocalStorage({fromBoardIdx, toBoardIdx}){
        this.getBoards().then((boards)=>{
            let from = boards[fromBoardIdx];
            let to = boards[toBoardIdx];
            boards[toBoardIdx] = from;
            boards[fromBoardIdx] = to;
            this.setBoards(boards);
            this.dispatchForceReload()
        })
    }

    swapBoardItem({boardIdx, fromIdx, toIdx, boardId, fromId, toId}){
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.swapBoardItemMongoDb({boardId, fromId, toId, fromIdx, toIdx}).then(()=>{
                    resolve()
                })
            }else{
                this.swapBoardItemLocalStorage({boardIdx, fromIdx, toIdx})
                resolve()
            }
        })
    }

    swapBoardItemMongoDb({boardId, fromId, toId, fromIdx, toIdx}){
        let f = new FetchService()
        let url = '/api/swapBoardItem'
        let data = {boardId, fromId, toId, fromIdx, toIdx}
        return f.doPost(url, data).then((res)=>{
            return res;
        })
    }

    swapBoardItemLocalStorage({boardIdx, fromIdx, toIdx}){
        this.getBoards().then((boards)=>{
            let board = boards[boardIdx]
            let from = board.list[fromIdx];
            let to = board.list[toIdx];
            board.list[toIdx] = from;
            board.list[fromIdx] = to;
            this.setBoards(boards);
            // this.dispatchForceReload()
        })
    }

    toggleBoardItem({boardIdx, boardId, boardItemIdx, boardItemId, newType}){
        return new Promise((resolve, reject)=>{
            if(this.isLoggedIn){
                this.toggleBoardItemMongoDb({boardId, boardItemId, newType}).then(()=>{
                    resolve()
                })
            }else{
                this.toggleBoardItemLocalStorage({boardIdx, boardItemIdx, newType}).then(()=>{
                    resolve()
                })
            }
        })

    }

    toggleBoardItemMongoDb({boardId, boardItemId, newType}){
        let f = new FetchService()
        let url = '/api/updateBoardItemType'
        return f.doPost(url, {boardId, boardItemId, newType}).then((res)=>{
            return res
        })
    }

    toggleBoardItemLocalStorage({boardIdx, boardItemIdx, newType}){
        return new Promise((resolve, reject)=>{
            let boards = this.getBoardsByLocalStorage()
            boards[boardIdx].list[boardItemIdx].type = newType;
            this.setBoards(boards);
            resolve()
        })
    }

}

CopyPasteService.prototype.dispatcher = null;
