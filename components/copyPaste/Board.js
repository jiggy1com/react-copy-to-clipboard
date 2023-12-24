import BoardItem from "@/components/copyPaste/BoardItem";
import {CopyPasteService} from "@/services/CopyPasteService";
import {DragAndDropService} from '@/services/DragAndDropService';
import {FaSave} from "react-icons/fa";
import {FaPlus, FaSpinner, FaThumbsUp, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {UserService} from "@/services/UserService";
import Link from "next/link";
import {generateRandomTitle} from "@/services/AppService";

export default function Board({board, boardId, boardIdx, notifyParent, isLoggedIn, loadBoards, clearBoards, isSingleBoard=false}) {

    // const boardId = board._id;
    const [currentValue, setCurrentValue] = useState(board.title);
    const [newValue, setNewValue] = useState(board.title);
    const cpService = new CopyPasteService(isLoggedIn)
    let dndService = null;

    const [saving, setSaving] = useState(false);
    const [wasSaved, setWasSaved] = useState(false)

    useEffect(()=>{

        let customEvent = new CustomEvent('test');
        notifyParent(customEvent);
        setupDragAndDrop();

    }, [])

    function setupDragAndDrop(){
        dndService = new DragAndDropService({
            dragSelectors: `#board-${boardId} .board-item`,
            dropSelectors: `#board-${boardId} .board-item`,
            onDrop: (obj)=> {
                let boardIdx = obj.dragElement.dataset.boardIdx;
                let fromIdx = obj.dragElement.dataset.boardItemIdx;
                let toIdx = obj.dropElement.dataset.boardItemIdx;
                let fromId = obj.dragElement.dataset.boardItemId;
                let toId = obj.dropElement.dataset.boardItemId;
                cpService.swapBoardItem({boardId, fromId, toId, boardIdx, fromIdx, toIdx}).then(()=>{
                    console.log('swapBoardItem completed')
                    // clearBoards()
                    // cpService.dispatchForceReload()
                    loadBoards();
                });
            }
        });
    }

    function renderBoardItems() {
        return board.list.map((boardItem, idx) => {
            return <BoardItem
                key={boardItem._id}
                loadBoards={loadBoards}
                notifyParent={notifyParent}
                setupDragAndDrop={setupDragAndDrop}
                isLoggedIn={isLoggedIn}
                boardId={boardId}
                boardIdx={boardIdx}
                boardItemId={boardItem._id}
                boardItemIdx={idx}
                boardItem={boardItem}/>
        })
    }

    function createBoardItem() {
        let payload = {
            text: generateRandomTitle(),
            boardIdx: boardIdx,
            boardId: boardId,
        }
        cpService.createBoardItem(payload).then((res)=>{
            loadBoards()
        });
    }

    function confirmDeleteBoard() {
        let conf = confirm('Are you sure you want to delete this board?');
        if (conf) {
            cpService.deleteBoard({boardId, boardIdx}).then(()=>{
                loadBoards()
            })
        }
    }

    function onChange(e) {
        setNewValue(e.target.value);
    }


    function onKeyUp(e) {
        if (e.key === 'Enter') {
            save()
        }
    }

    function save() {
        document.querySelector('#save-' + boardId).blur()
        if(!saving){
            setSaving(true);
            cpService.updateBoard({boardId, boardIdx, newValue}).then(()=>{
                setCurrentValue(newValue);
                setSaving(false);
                setWasSaved(true)
                setTimeout(() => {
                    setWasSaved(false)
                }, 1500)
            })
        }

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

    function renderBoardLink(){
        if(!isLoggedIn){
            return <></>
        }
        return (
            <div className={"col-auto p-1"}>
                <Link className={"btn btn-primary float-right"}
                      title={"View Board"}
                      target={"_blank"}
                      href={"/board/" + board._id}>
                    <FaUpRightFromSquare />
                </Link>
            </div>
        )
    }

    function getBoardLink(){
        return '/board/' + board._id
    }

    function getBoardClassList(){
        let classList = 'mb-3 board ';
        classList += (isSingleBoard)
            ? "col-12"
            : "col-12 col-sm-6 col-lg-6 col-xl-4";
        return classList;
    }

    return (
        <div className={getBoardClassList()}
             id={'board-' + boardId}
             data-board-id={boardId}
             data-board-idx={boardIdx}>
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"row g-2"}>
                        <div className={"col p-1"}>
                            <input type={"text"}
                                   className={getInputClassList()}
                                   name={"title"}
                                   defaultValue={currentValue.toString()}
                                   onKeyUp={onKeyUp}
                                   onChange={onChange}/>
                        </div>
                        <div className={"col-auto p-1"}>
                            <button id={"save-" + boardId}
                                    className={"btn btn-primary"}
                                    title={"Save"}
                                    onClick={save}>
                                {renderSaveIcon()}
                            </button>
                        </div>
                        <div className={"col-auto p-1"}>
                            <button className={"btn btn-primary float-right"}
                                    title={"Add Item"}
                                    onClick={createBoardItem}>
                                <FaPlus/>
                            </button>
                        </div>
                        {renderBoardLink()}
                        <div className={"col-auto p-1"}>
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
