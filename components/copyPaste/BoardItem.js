import {CopyPasteService} from "@/services/CopyPasteService";
import {useState} from "react";
import {FaThumbsUp, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {FaCopy, FaHtml5, FaSave} from "react-icons/fa";

export default function BoardItem({boardIdx, boardItem, boardItemIdx}) {

    const service = new CopyPasteService()
    let newValue = boardItem.text;

    const [wasCopied, setWasCopied] = useState(false);
    const [wasSaved, setWasSaved] = useState(false);

    function onClick() {
        let conf = confirm('Are you sure you want to delete this item?')
        if (conf) {
            service.deleteBoardItem(boardIdx, boardItemIdx)
        } else {
            console.log('do not delete')
        }
    }

    function onChange(e) {
        newValue = e.target.value;
    }

    function onKeyUp(e) {
        if (e.key === 'Enter') {
            newValue = e.target.value;
            save()
        }
    }

    function doCopy(e) {
        navigator.clipboard.writeText(boardItem.text)
        setWasCopied(true)
        setTimeout(() => {
            setWasCopied(false)
        }, 1000)
    }

    function doOpen(){
        if(isURL()){
            window.open(boardItem.text)
        }
    }

    function save() {
        service.updateBoardItem(boardIdx, boardItemIdx, newValue)
        setWasSaved(true)
        setTimeout(() => {
            setWasSaved(false)
        }, 1000)
    }

    function renderWasCopied() {
        if (wasCopied) {
            return (
                <span className={"ml-2"}>
                    <FaThumbsUp/>
                </span>
            )
        } else {
            return (
                <></>
            )
        }
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
                <></>
            )
        }
    }

    function isURL(){
        return boardItem.text.slice(0, 4) === 'http'
    }

    function getButtonLinkClassList(){
        let classList = ['btn', 'btn-primary'];
        if(!isURL()){
            classList.push('disabled')
        }
        return classList.join(' ');
    }

    return (
        <div className={"row mb-3 board-item "}
             id={"board-item-" + boardIdx}
             data-id={boardItem._id}
             data-board-idx={boardIdx}
             data-board-item-idx={boardItemIdx}>
            <div className={"col-auto"}>
                <button className={"btn btn-danger"}
                        title={"Delete Item"}
                        onClick={onClick}>
                    <FaX/> {boardItemIdx}
                </button>
            </div>
            <div className={"col"}>
                <input
                    type={"text"}
                    className={"form-control"}
                    defaultValue={boardItem.text}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                />
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
                <button className={"btn btn-primary"}
                        title={"Copy"}
                        onClick={doCopy}>
                    <FaCopy/>
                </button>
                {renderWasCopied()}
            </div>
            <div className={"col-auto"}>
                <button className={getButtonLinkClassList()}
                        title={"Open"}
                        onClick={doOpen}>
                    <FaUpRightFromSquare />
                </button>
            </div>
        </div>
    )
}
