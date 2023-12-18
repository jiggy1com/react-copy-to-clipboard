import {UserService} from "@/services/UserService";
import {FetchService} from "@/services/FetchService";

const LOCAL_STORAGE_KEY = 'cp';

const BOARDS = [];
const BOARD_ITEM_LIST = [];
const BOARD_ITEM = {
    title: '',
    list: BOARD_ITEM_LIST
}

const RANDOM_TITLES = [
    'Grocery List',
    'Shopping List',
    'School List',
    'Kids Names',
    'List of Miracles',
    'Recipes',
    'My Organs',
    'To do or not todo',
    'My Oh My!',
    'Days of the week',
    'Uh oh, forgot to set a title',
    'I can not think of anything else',
    'Test',
    'Try Again',
    'Just Kidding',
];

export class CopyPasteService {

    constructor(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.boards = this.getBoards();
        this.createDispatcher();
    }

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

    // thank you mozilla
    getRandomIntInclusive(min = 0, max = RANDOM_TITLES.length) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }

    generateRandomTitle() {
        return RANDOM_TITLES[this.getRandomIntInclusive()];
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
                resolve(this.createBoardLocalStorage(title))
            }
        })

    }

    createBoardLocalStorage(title){
        if (!title) {
            title = this.generateRandomTitle();
        }

        // generate board item
        let boardItem = Object.assign(BOARD_ITEM, {
            title: title
        });

        // get and append boards
        let boards = this.getBoards();
        boards.push(boardItem);

        // write to local storage
        this.setBoards(boards);
        return this.getBoards()
    }



    readBoard(idx) {
        return this.getBoards()[idx]
    }

    updateBoard(boardIdx, title) {
        let boards = this.getBoards()
        boards[boardIdx].title = title;
        this.setBoards(boards);
    }

    deleteBoard(boardIdx) {
        let boards = this.getBoards()
        boards.splice(boardIdx, 1)
        this.setBoards(boards);
        this.dispatchForceReload();
    }

    // lists crud

    createBoardItem(item, where) {
        let boards = this.getBoards();
        boards[where].list.push(item);
        this.setBoards(boards);
    }

    readList() {

    }

    updateBoardItem(boardIdx, boardItemIdx, value) {
        let boards = this.getBoards()
        boards[boardIdx].list[boardItemIdx] = value;
        this.setBoards(boards);
    }

    deleteBoardItem(boardIdx, boardItemIdx) {
        let boards = this.getBoards()
        boards[boardIdx].list.splice(boardItemIdx, 1);
        this.setBoards(boards);
        this.dispatchForceReload();
    }

    // additional methods

    swapBoard(fromBoardIdx, toBoardIdx){
        let boards = this.getBoards();
        let from = boards[fromBoardIdx];
        let to = boards[toBoardIdx];
        boards[toBoardIdx] = from;
        boards[fromBoardIdx] = to;
        this.setBoards(boards);
        this.dispatchForceReload()
    }

    swapBoardItem(boardIdx, fromIdx, toIdx){
        let boards = this.getBoards();
        let board = boards[boardIdx]
        let from = board.list[fromIdx];
        let to = board.list[toIdx];
        board.list[toIdx] = from;
        board.list[fromIdx] = to;
        this.setBoards(boards);
        this.dispatchForceReload()
    }

}

CopyPasteService.prototype.dispatcher = null;
