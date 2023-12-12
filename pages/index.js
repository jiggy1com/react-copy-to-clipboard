import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import Board from "@/components/copyPaste/Board";
import Link from "next/link";

const service = new CopyPasteService();

export default function Index({defaultBoards}){

    const [boards, setBoards] = useState([]);

    useEffect(()=>{

        if(!service.dispatcher){
            service.createDispatcher()
        }

        service.dispatcher.addEventListener('reload', (e)=>{
            console.log('heard something', e)
            setBoards(service.getBoards())
        })

        service.dispatcher.addEventListener('forceReload', (e)=>{
            setBoards([])
            setTimeout(()=>{
                setBoards(service.getBoards())
            },1)
        })

        setBoards(service.getBoards())
    }, [])

    function renderBoards(){
        if(boards.length === 0){
            return (
                <div>
                    No boards. Try creating one!
                </div>
            )
        }else{
            // return (
            //     <>{JSON.stringify(boards)}</>
            // )
            return boards.map((board, idx)=>{
                return (
                    <Board
                        key={idx}
                        boardIdx={idx}
                        board={board} />
                )
            })
        }
    }

    function test(){
        // setBoards(service.getBoards());
        service.dispatch()
    }

    function clearBoards(){
        service.clearAllBoards();
    }

    function addBoard(){
        service.createBoard()
    }

    return (
        <div>
            <div className={"container-fluid mb-5"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <h1>Copy to Clipboard Manager</h1>
                        <div className={"alert alert-info"}>
                            Create a board, and add as many items as you like.<br />
                            Data is saved to localStorage.<br />
                            To copy a value to your clipboard, click the copy button.
                        </div>

                        <button className={"btn btn-primary mb-3"} onClick={addBoard}>
                            Add New Board
                        </button>

                        <div className={"row"}>
                            {renderBoards()}
                        </div>

                        <p>State</p>

                        <pre>
                        {JSON.stringify(boards, null, 4)}
                        </pre>

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

export async function getStaticProps() {
    return {
        props: {
            defaultBoards: []
        }
    }
}
