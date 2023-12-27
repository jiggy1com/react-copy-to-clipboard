import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import Board from "@/components/copyPaste/Board";
import Link from "next/link";
import H1Component from "@/components/text/H1Component";
import {DragAndDropService} from "@/services/DragAndDropService";
import {UserService} from "@/services/UserService";
import {LoadingComponent} from "@/components/loading/LoadingComponent";
import {FaEye, FaPlus, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {FaCopy, FaSave} from "react-icons/fa";
import {ServerService} from "@/services/ServerService";
import {IndexSignedIn} from "@/components/index/IndexSignedIn";
import {IndexSignedOut} from "@/components/index/IndexSignedOut";

export default function Index({defaultBoards, isLoggedIn}) {

    const [boards, setBoards] = useState([]);
    const [isLoadingBoards, setIsLoadingBoards] = useState(false);
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

        return () => {
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

    function notifyParent() {
        console.log('notifyParent')
        dndService = new DragAndDropService({
            dragSelectors: `.board`,
            dropSelectors: `.board`,
            onDrop: (obj) => {
                console.warn('onDrop:obj', obj);
                let fromBoardIdx = obj.dragElement.dataset.boardIdx;
                let toBoardIdx = obj.dropElement.dataset.boardIdx;
                let fromBoardId = obj.dragElement.dataset.boardId;
                let toBoardId = obj.dropElement.dataset.boardId;
                // setBoards([])
                service.swapBoard({
                    fromBoardIdx,
                    toBoardIdx,
                    fromBoardId,
                    toBoardId
                }).then(() => {
                    loadBoards()
                })
            }
        });
    }

    function loadBoards() {
        console.warn('loadBoards')
        setIsLoadingBoards(true);
        service.getBoards().then((resp) => {
            console.log('loadBoards:resp', resp)
            setBoards(resp);
            setIsLoadingBoards(false);
        })
    }

    function addBoard() {
        service.createBoard().then((res) => {
            setBoards(res.data);
        })
    }

    function renderState(){
        let service = new ServerService()
        if(service.isDev()){
            return (
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
            )
        }else{
            return (
                <></>
            )
        }
    }

    function renderTop(){
        if(isLoggedIn){
            return <IndexSignedIn />
        }else{
            return <IndexSignedOut addBoard={addBoard} />
        }
    }

    return (
        <div className={"container-fluid mt-5 mb-5"}>
            <div className={"row"}>
                <div className={"col-12"}>



                    {/*about the app*/}

                    {renderTop()}


                    {/*add board button*/}

                    <button className={"btn btn-primary mb-3"}
                            onClick={addBoard}>
                        Add New Board
                    </button>

                    {/*boards*/}

                    <div className={"row"}>
                        <LoadingComponent isLoading={isLoadingBoards}/>
                        {renderBoards()}
                    </div>

                    {/*state*/}

                    {renderState()}

                    {/*features*/}



                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({req}) {

    let userService = new UserService(req);

    return {
        props: {
            defaultBoards: [],
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
