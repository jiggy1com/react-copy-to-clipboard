import BoardItem from "@/components/copyPaste/BoardItem";
import {CopyPasteService} from "@/services/CopyPasteService";
import {DragAndDropService} from '@/services/DragAndDropService';
import {FaSave} from "react-icons/fa";
import {FaPlus, FaSpinner, FaThumbsUp, FaX} from "react-icons/fa6";
import {useEffect, useState} from "react";
import {UserService} from "@/services/UserService";

export default function Board({board, boardIdx, notifyParent, isLoggedIn, loadBoards}) {

    const boardId = board._id;
    const cpService = new CopyPasteService(isLoggedIn)
    let dndService = null;

    const [saving, setSaving] = useState(false);
    const [wasSaved, setWasSaved] = useState(false)
    let newValue = board.title;

    useEffect(()=>{

        console.log('board.js:useEffect')
        let customEvent = new CustomEvent('test');
        notifyParent(customEvent);

        dndService = new DragAndDropService({
            dragSelectors: `#board-${boardIdx} .board-item`,
            dropSelectors: `#board-${boardIdx} .board-item`,
            onDrop: (obj)=> {
                let boardIdx = obj.dragElement.dataset.boardIdx;
                let fromIdx = obj.dragElement.dataset.boardItemIdx;
                let toIdx = obj.dropElement.dataset.boardItemIdx;
                cpService.swapBoardItem(boardIdx, fromIdx, toIdx);
            }
        });

        console.log('useEffect', dndService)
    }, [])

    function handleOnDrop(){
        console.log()
    }

    function renderBoardItems() {
        return board.list.map((boardItem, idx) => {
            return <BoardItem
                key={idx}
                loadBoards={loadBoards}
                isLoggedIn={isLoggedIn}
                boardId={boardId}
                boardIdx={boardIdx}
                boardItemIdx={idx}
                boardItem={boardItem}/>
        })
    }

    function createBoardItem() {
        console.log('onclick:boardIdx', boardIdx)
        let payload = {
            item: '',
            boardIdx: boardIdx,
            boardId: boardId,
        }
        cpService.createBoardItem(payload).then((res)=>{
            console.log('cpService.createBoardItem', res)
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
        newValue = e.target.value
    }

    function onKeyUp(e) {
        console.log('onkeyup', e.key)
        if (e.key === 'Enter') {
            save()
        }
    }

    function save() {
        document.querySelector('#save-' + boardId).blur()
        if(!saving){
            setSaving(true);
            cpService.updateBoard({boardId, boardIdx, newValue}).then(()=>{

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

    return (
        <div className={"col-12 col-md-6 col-lg-4 mb-3 board"}
             id={"board-" + boardIdx}
             data-board-id={boardId}
             data-board-idx={boardIdx}>
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"row g-2"}>
                        <div className={"col"}>
                            <input type={"text"}
                                   className={getInputClassList()}
                                   name={"title"}
                                   defaultValue={board.title}
                                   onKeyUp={onKeyUp}
                                   onChange={onChange}/>
                        </div>
                        <div className={"col-auto"}>
                            <button id={"save-" + boardId} className={"btn btn-primary"}
                                    title={"Save"}
                                    onClick={save}>
                                {renderSaveIcon()}
                            </button>
                        </div>
                        <div className={"col-auto"}>
                            <button className={"btn btn-primary float-right"}
                                    title={"Add Item"}
                                    onClick={createBoardItem}>
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

// export async function getServerSideProps({req}){
//     let userService = new UserService(req);
//     return {
//         props:{
//             isLoggedIn: userService.isLoggedIn()
//         }
//     }
// }
