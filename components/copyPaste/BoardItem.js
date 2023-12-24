import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import {FaSpinner, FaThumbsUp, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {FaCopy, FaHtml5, FaSave} from "react-icons/fa";

export default function BoardItem({boardId, boardIdx, boardItem, boardItemId, boardItemIdx, isLoggedIn, loadBoards, notifyParent, setupDragAndDrop}) {

    const service = new CopyPasteService(isLoggedIn)

    const [currentValue, setCurrentValue] = useState(boardItem.text);
    const [newValue, setNewValue] = useState(boardItem.text);
    const [wasCopied, setWasCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [wasSaved, setWasSaved] = useState(false);

    useEffect(()=>{
        console.log('boardItem:useEffect')
        setupDragAndDrop()
    }, [])

    function deleteBoardItem() {
        let conf = confirm('Are you sure you want to delete this item?')
        if (conf) {
            service.deleteBoardItem({boardId, boardItemId: boardItem._id, boardIdx, boardItemIdx}).then(()=>{
                loadBoards()
            })
        }
    }

    function onChange(e) {
        setNewValue(e.target.value)
    }

    function onKeyUp(e) {
        if (e.key === 'Enter') {
            setNewValue(e.target.value)
            save()
        }
    }

    function doCopy(e) {
        navigator.clipboard.writeText(currentValue.toString()).then(()=>{
            setWasCopied(true)
            setTimeout(() => {
                setWasCopied(false)
            }, 1500)
        })
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
                setCurrentValue(newValue);
                setSaving(false);
                setWasSaved(true);
                setTimeout(() => {
                    setWasSaved(false)
                    loadBoards()
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
        return currentValue.slice(0, 4) === 'http'
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
             id={"board-item-" + boardItemId}
             data-id={boardItemId}
             data-board-id={boardId}
             data-board-idx={boardIdx}
             data-board-item-id={boardItemId}
             data-board-item-idx={boardItemIdx}>
            <div className={"col-auto p-1"}>
                <button className={"btn btn-danger"}
                        title={"Delete Item"}
                        onClick={deleteBoardItem}>
                    <FaX/>
                </button>
            </div>
            <div className={"col p-1"}>
                <input
                    type={"text"}
                    className={getInputClassList()}
                    defaultValue={currentValue.toString()}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                />
            </div>
            <div className={"col-auto p-1"}>
                <button id={"save-" + boardItemId}
                        className={"btn btn-primary"}
                        title={"Save"}
                        onClick={save}>
                    {renderSaveIcon()}
                </button>
            </div>
            <div className={"col-auto p-1"}>
                <button className={"btn btn-primary"}
                        title={"Copy"}
                        onClick={doCopy}>
                    <FaCopy/>
                </button>
                {renderWasCopied()}
            </div>
            <div className={"col-auto p-1"}>
                <button className={getButtonLinkClassList()}
                        title={"Open"}
                        onClick={doOpen}>
                    <FaUpRightFromSquare />
                </button>
            </div>
        </div>
    )
}
