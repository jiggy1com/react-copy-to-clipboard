import BoardItem from "@/components/copyPaste/BoardItem";
import {CopyPasteService} from "@/services/CopyPasteService";
import {FaSave} from "react-icons/fa";
import {FaPlus, FaThumbsUp, FaX} from "react-icons/fa6";
import {useState} from "react";

export default function Board({board, boardIdx}) {

    const service = new CopyPasteService()
    const [wasSaved, setWasSaved] = useState(false)
    let newValue = board.title;

    function renderBoardItems() {
        return board.list.map((boardItem, idx) => {
            return <BoardItem
                key={idx}
                boardIdx={boardIdx}
                boardItemIdx={idx}
                boardItem={boardItem}/>
        })
    }

    function onClick() {
        console.log('onclick:boardIdx', boardIdx)
        service.createBoardItem('', boardIdx);
    }

    function confirmDeleteBoard() {
        let conf = confirm('are you sure you want to delete this board');
        if (conf) {
            service.deleteBoard(boardIdx)
        }
    }

    function onChange(e) {
        newValue = e.target.value
    }

    function onKeyUp(e) {
        console.log('onkeyup', e.key)
        if (e.key === 'Enter') {
            save()
        }
    }

    function save() {

        service.updateBoard(boardIdx, newValue)
        setWasSaved(true)
        setTimeout(() => {
            setWasSaved(false)
        }, 1000)
    }

    function renderWasSaved() {
        if (wasSaved) {
            return (
                <span className={"ml-2"}>
                    <FaThumbsUp/>
                </span>
            )
        } else {
            return (
                <>

                </>
            )
        }
    }

    return (
        <div className={"col-12 col-md-6 col-lg-4 mb-3"}>
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"row g-2"}>
                        <div className={"col"}>
                            <input type={"text"}
                                   className={"form-control"}
                                   name={"title"}
                                   defaultValue={board.title}
                                   onKeyUp={onKeyUp}
                                   onChange={onChange}/>
                        </div>
                        <div className={"col-auto"}>
                            <button className={"btn btn-primary"}
                                    title={"Save"}
                                    onClick={save}>
                                <FaSave/>
                            </button>
                            {renderWasSaved()}
                        </div>
                        <div className={"col-auto"}>
                            <button className={"btn btn-primary float-right"}
                                    title={"Add Item"}
                                    onClick={onClick}>
                                <FaPlus/>
                            </button>
                        </div>
                        <div className={"col-auto"}>
                            <button className={"btn btn-danger float-right"}
                                    title={"Delete Board"}
                                    onClick={confirmDeleteBoard}>
                                <FaX/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"card-body"}>
                    {renderBoardItems()}
                </div>
            </div>
        </div>
    )
}
