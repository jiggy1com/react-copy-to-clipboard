import {CopyPasteService} from "@/services/CopyPasteService";
import {useState} from "react";
import {FaSpinner, FaThumbsUp, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {FaCopy, FaHtml5, FaSave} from "react-icons/fa";

export default function BoardItem({boardId, boardIdx, boardItem, boardItemIdx, isLoggedIn, loadBoards}) {

    const service = new CopyPasteService(isLoggedIn)
    let newValue = boardItem.text;

    const [wasCopied, setWasCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [wasSaved, setWasSaved] = useState(false);

    function deleteBoardItem() {
        let conf = confirm('Are you sure you want to delete this item?')
        if (conf) {
            service.deleteBoardItem({boardId, boardItemId: boardItem._id, boardIdx, boardItemIdx}).then(()=>{
                console.log('should be loadBoards')
                loadBoards()
            })
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
        document.querySelector('#save-' + boardItem._id).blur()
        if(!saving){
            setSaving(true);
            service.updateBoardItem({boardId, boardItemId: boardItem._id, boardIdx, boardItemIdx, newValue}).then((res)=>{
                setSaving(false);
                setWasSaved(true)
                setTimeout(() => {
                    setWasSaved(false)
                }, 1500)
            })
        }
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

    function renderSaveIcon(){
        if(saving){
            return (
                <FaSpinner />
            )
        }else if(wasSaved){
            return (
                <FaThumbsUp />
            )
        } else{
            return (
                <FaSave />
            )
        }
    }

    function getInputClassList(){
        let classList = 'form-control ';
        if(saving){
            classList += 'border-warning'
        }else if(wasSaved){
            classList += 'border-success';
        } else{

        }
        return classList;
    }

    return (
        <div className={"row mb-3 board-item "}
             id={"board-item-" + boardIdx}
             data-id={boardItem._id}
             data-board-id={boardId}
             data-board-idx={boardIdx}
             data-board-item-idx={boardItemIdx}>
            <div className={"col-auto"}>
                <button className={"btn btn-danger"}
                        title={"Delete Item"}
                        onClick={deleteBoardItem}>
                    <FaX/> {boardItemIdx}
                </button>
            </div>
            <div className={"col"}>
                {boardItem._id}
                <input
                    type={"text"}
                    className={getInputClassList()}
                    defaultValue={boardItem.text}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                />
            </div>
            <div className={"col-auto"}>
                <button id={"save-" + boardItem._id}
                        className={"btn btn-primary"}
                        title={"Save"}
                        onClick={save}>
                    {renderSaveIcon()}
                </button>
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
