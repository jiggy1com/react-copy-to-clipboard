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

        console.log('pages/index.js:useEffect')

        if (!service.dispatcher) {
            service.createDispatcher()
        }

        service.dispatcher.addEventListener('reload', (e) => {
            console.log('heard something', e)
            // setBoards(service.getBoards())
        })

        service.dispatcher.addEventListener('forceReload', (e) => {
            setBoards([])
            setTimeout(() => {
                // setBoards(service.getBoards())
            }, 1)
        })
// console.log('boards', service.getBoards())
        loadBoards()
        // setBoards(service.getBoards())

        // dndService = new DragAndDropService({
        //     dragSelectors: '.board',
        //     dropSelectors: '.board',
        //     onDrop: (obj)=> {
        //         let fromBoardIdx = obj.dragElement.dataset.boardIdx;
        //         let toBoardIdx = obj.dropElement.dataset.boardIdx;
        //         service.swapBoard(fromBoardIdx, toBoardIdx);
        //     }
        // });

    }, [])

    function renderBoards() {
        if (boards.length === 0) {
            return (
                <div>
                    No boards. Try creating one!
                </div>
            )
        } else {
            // return (
            //     <>{JSON.stringify(boards)}</>
            // )
            return boards.map((board, idx) => {
                return (
                    <Board
                        isLoggedIn={isLoggedIn}
                        loadBoards={loadBoards}
                        notifyParent={notifyParent}
                        key={idx}
                        boardIdx={idx}
                        board={board}/>
                )
            })
        }
    }

    function notifyParent(){
        dndService = new DragAndDropService({
            dragSelectors: '.board',
            dropSelectors: '.board',
            onDrop: (obj)=> {
                let fromBoardIdx = obj.dragElement.dataset.boardIdx;
                let toBoardIdx = obj.dropElement.dataset.boardIdx;
                service.swapBoard(fromBoardIdx, toBoardIdx);
            }
        });
    }

    function loadBoards(){
        console.log('loadBoards')
        service.getBoards().then((resp)=>{
            console.log('boards:resp', resp);
            setBoards(resp);
        })
    }

    function test() {
        // setBoards(service.getBoards());
        service.dispatch()
    }

    function clearBoards() {
        service.clearAllBoards();
    }

    function addBoard() {
        service.createBoard().then((res)=>{
            console.log('res', res)
            setBoards(res.data);
        })
    }

    return (
        <div>
            <div className={"container-fluid mb-5"}>
                <div className={"row"}>
                    <div className={"col-12"}>

                        {/*about the app*/}

                        <div className={"alert alert-info"}>
                            Create a board, and add as many items as you like.<br/>
                            Data is saved to localStorage until you create an account.<br/>
                            Sign into your account to retrieve your clipboard manager.<br />
                            To copy a value to your clipboard, click the copy button.
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
                                    <li>add drag n drop functionality to reorder list items and boards</li>
                                    <li>add create account & sign in functionality</li>
                                    <li>add API to save data to database (mongodb) so list can be retrieved from any browser</li>
                                    <li>update board item from text to object (as originally intended, oops!)
                                        <ul>
                                            <li>item type default: text</li>
                                            <li>allow item type to be textarea</li>
                                            <li>auto scale textarea to maximum, default X rows</li>
                                            <li>allow user to set maximum / no maximum</li>
                                        </ul>
                                    </li>
                                    <li>auto update local storage if board item is text, to be an object before breaking the site</li>
                                    <li>?</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/*<button onClick={clearBoards} className={"btn btn-primary"}>*/}
            {/*    start over*/}
            {/*</button>*/}

            {/*<button onClick={test} className={"btn btn-primary"}>*/}
            {/*    test*/}
            {/*</button>*/}

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

// export async function getStaticProps() {
//     return {
//         props: {
//             req: req,
//             defaultBoards: []
//         }
//     }
// }
