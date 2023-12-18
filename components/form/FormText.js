import {useEffect, useState} from "react";
import {FaEye, FaEyeSlash, FaToggleOn} from "react-icons/fa6";

export default function FormText({fieldConfig, parentOnChange, parentHandleOnKeyUp}){

    let originalType = fieldConfig.type;

    useEffect(()=>{
        if(!hasSentInitialValue || fieldConfig.type === 'hidden'){
            parentOnChange({
                name: fieldConfig.name,
                value: fieldConfig.defaultValue
            })
        }
        setHasSentInitialValue(true);
    }, [])

    const [hasSentInitialValue, setHasSentInitialValue] = useState(false);
    const [localType, setLocalType] = useState(fieldConfig.type)
    function localOnChange(e){

        parentOnChange({
            name: e.target.name,
            value: e.target.value
        })

        if(fieldConfig.onChangeCallback
            && typeof fieldConfig.onChangeCallback === 'function'){
            fieldConfig.onChangeCallback(e);
        }
    }

    function handleOnKeyUp(e){
        if(parentHandleOnKeyUp
            && typeof parentHandleOnKeyUp === 'function'){
            parentHandleOnKeyUp(e)
        }
    }

    function renderPasswordToggle(){
        if(originalType === 'password'){
            return (
                <button className={"btn btn-primary password-toggle"} onClick={togglePasswordType}>
                    {renderEye()}
                </button>
            )
        }else{
            return (
                <></>
            )
        }
    }

    function renderEye(){
        if(localType === 'text'){
            return (
                <FaEye />
            )
        }else{
            return (
                <FaEyeSlash />
            )
        }
    }

    function togglePasswordType(e){
        console.log('togglePasswordType')
        e.preventDefault()
        e.stopPropagation()
        if(localType === 'password'){
            setLocalType('text')
        }else{
            setLocalType('password')
        }
    }

    return (
        <div className={"form-group"}>
            {fieldConfig.label.length > 0 &&
                <label htmlFor={fieldConfig.id}>
                    {fieldConfig.label}
                </label>
            }
            <input
                id={fieldConfig.id}
                placeholder={fieldConfig.placeholder}
                type={localType}
                name={fieldConfig.name}
                // value={fieldConfig.defaultValue}
                defaultValue={fieldConfig.defaultValue}
                onChange={localOnChange}
                onKeyUp={handleOnKeyUp}
                className={"form-control"} />

            {renderPasswordToggle()}

        </div>
    )
}
