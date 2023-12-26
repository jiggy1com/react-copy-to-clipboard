import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import Board from "@/components/copyPaste/Board";
import Link from "next/link";
import H1Component from "@/components/text/H1Component";
import {DragAndDropService} from "@/services/DragAndDropService";
import {UserService} from "@/services/UserService";

export default function Index({defaultBoards, isLoggedIn}) {

    const [boards, setBoards] = useState([]);
    const service = new CopyPasteService(isLoggedIn);

    let dndService = null;

    useEffect(() => {

        console.log('index:useEffect')

        service.runTempFix()

        if (!service.dispatcher) {
            service.createDispatcher()
        }

        service.dispatcher.addEventListener('reload', (e) => {
            console.log('index:reload')
            loadBoards()
        })

        service.dispatcher.addEventListener('forceReload', (e) => {
            console.log('index:forceReload')
            setBoards([])
            setTimeout(() => {
                console.log('calling loadBoards')
                loadBoards();
            }, 2000)
        })

        loadBoards()

        return ()=>{
            // console.log('useEffect clean up function')
        }

    }, ['boards'])

    function renderBoards() {
        if (boards.length === 0) {
            return (
                <div className={"col-12"}>
                    No boards. Try creating one!
                </div>
            )
        } else {
            return boards.map((board, idx) => {
                return (
                    <Board
                        key={board._id}
                        isLoggedIn={isLoggedIn}
                        loadBoards={loadBoards}
                        notifyParent={notifyParent}
                        boardIdx={idx}
                        boardId={board._id}
                        board={board}/>
                )
            })
        }
    }

    function notifyParent(){
        console.log('notifyParent')
        dndService = new DragAndDropService({
            dragSelectors: `.board`,
            dropSelectors: `.board`,
            onDrop: (obj)=> {
                console.warn('onDrop:obj', obj);
                let fromBoardIdx = obj.dragElement.dataset.boardIdx;
                let toBoardIdx = obj.dropElement.dataset.boardIdx;
                let fromBoardId = obj.dragElement.dataset.boardId;
                let toBoardId = obj.dropElement.dataset.boardId;
                // setBoards([])
                service.swapBoard({fromBoardIdx, toBoardIdx, fromBoardId, toBoardId}).then(()=>{
                    loadBoards()
                })
            }
        });
    }

    function loadBoards(){
        service.getBoards().then((resp)=>{
            console.log('loadBoards:resp', resp)
            setBoards(resp);
        })
    }

    function addBoard() {
        service.createBoard().then((res)=>{
            setBoards(res.data);
        })
    }

    return (
        <div className={"container-fluid mt-5 mb-5"}>
                <div className={"row"}>
                    <div className={"col-12"}>

                        {/*about the app*/}

                        <div className={"alert alert-info"}>
                            Create a board, and add as many items as you like.<br/>
                            Data is saved to localStorage until you create an account.<br/>
                            Sign into your account to retrieve your clipboard manager.<br />
                            To copy a value to your clipboard, click the copy button.<br />
                            Data is NOT currently encrypted, so please do not store passwords or other sensitive information until further notice.
                        </div>

                        {/*add board button*/}

                        <button className={"btn btn-primary mb-3"}
                                onClick={addBoard}>
                            Add New Board
                        </button>

                        {/*boards*/}

                        <div className={"row"}>
                            {renderBoards()}
                        </div>

                        {/*state*/}

                        <div className={"card mb-3"}>
                            <div className={"card-header"}>
                                State
                            </div>
                            <div className={"card-body"}>
                                <pre>
                        {JSON.stringify(boards, null, 4)}
                        </pre>
                            </div>
                        </div>

                        {/*features*/}

                        <div className={"card mb-3"}>
                            <div className={"card-header"}>
                                Features TODO:
                            </div>
                            <div className={"card-body"}>
                                <ul>
                                    <li>set database state to match localstorage state when new user is created</li>
                                    <li>update board item from text to object (as originally intended, oops!)
                                        <ul>
                                            <li>item type default: text</li>
                                            <li>allow item type to be textarea</li>
                                            <li>auto scale textarea to maximum, default X rows</li>
                                            <li>allow user to set maximum / no maximum</li>

                                        </ul>
                                    </li>
                                    <li>encrypt stored data, decrypt when returning
                                        <ul>
                                            <li>use a different encryption salt than used for account passwords</li>
                                        </ul>
                                    </li>
                                    <li>add error handlers throughout application</li>
                                    <li>auto update local storage if board item is text, to be an object before breaking the site</li>
                                    <li>?</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    )
}

export async function getServerSideProps({req}){

    let userService = new UserService(req);

    return {
        props:{
            defaultBoards: [],
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
