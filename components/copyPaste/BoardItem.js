import {CopyPasteService} from "@/services/CopyPasteService";
import {useState} from "react";
import {FaThumbsUp, FaX} from "react-icons/fa6";
import {FaCopy, FaSave} from "react-icons/fa";

export default function BoardItem({boardIdx, boardItem, boardItemIdx}){

    const service = new CopyPasteService()
    let newValue = '';

    const [wasCopied, setWasCopied] = useState(false);
    const [wasSaved, setWasSaved] = useState(false);

    function onClick(){
        let conf = confirm('Are you sure you want to delete this item?')
        if(conf){
            service.deleteBoardItem(boardIdx, boardItemIdx)
        }else{
            console.log('do not delete')
        }
    }

    function onChange(e){
        newValue = e.target.value;
    }

    function onKeyUp(e){
        if(e.key === 'Enter'){
            newValue = e.target.value;
            save()
        }
    }

    function doCopy(e){
        navigator.clipboard.writeText(boardItem)
        setWasCopied(true)
        setTimeout(()=>{
            setWasCopied(false)
        },1000)
    }

    function save(){
        service.updateBoardItem(boardIdx, boardItemIdx, newValue)
        setWasSaved(true)
        setTimeout(()=>{
            setWasSaved(false)
        },1000)
    }

    function renderWasCopied(){
        if(wasCopied){
            return (
                <span className={"ml-2"}>
                    <FaThumbsUp />
                </span>
            )
        }else{
            return (
                <></>
            )
        }
    }

    function renderWasSaved(){
        if(wasSaved){
            return (
                <span className={"ml-2"}>
                    <FaThumbsUp />
                </span>
            )
        }else{
            return (
                <></>
            )
        }
    }

    return(
        <div className={"row mb-3"}>
            <div className={"col-auto"}>
                <button className={"btn btn-danger"} onClick={onClick}>
                    <FaX />
                </button>
            </div>
            <div className={"col"}>
                <input
                    type={"text"}
                    className={"form-control"}
                    defaultValue={boardItem}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                        />
            </div>
            <div className={"col-auto"}>
                <button className={"btn btn-primary"} onClick={save}>
                    <FaSave />
                </button>
                {renderWasSaved()}
            </div>
            <div className={"col-auto"}>
                <button className={"btn btn-primary"} onClick={doCopy}>
                    <FaCopy />
                </button>
                {renderWasCopied()}
            </div>
        </div>
    )
}
