import {useEffect, useRef, useState} from "react";

export function FormRadioItem({option, formRadioOnChangeHandler}){

    const [hasFiredOnce, setHasFiredOnce] = useState(false);

    useEffect(()=>{
        // let form know the default value when the component loads
        if(!hasFiredOnce && option.defaultChecked){
            setTimeout(()=>{
                let o = {
                    target: {
                        checked: true,
                        name: option.name,
                        value: option.value,
                    }
                }
                handleOnChange(o)
            },1000)
        }
        setHasFiredOnce(true);
    }, [])

    function handleOnChange(e){
        formRadioOnChangeHandler(e);
    }

    return (
        <>
            <div className={"form-check ml-3"}>

                <input
                    className={"form-check-input"}
                    type={"radio"}
                    id={option.id}
                    name={option.name}
                    value={option.value}
                    defaultChecked={option.defaultChecked}
                    onChange={handleOnChange}
                />

                <label
                    className={"form-check-label"}
                    htmlFor={option.id}>
                    {option.label}
                </label>

            </div>
        </>
    )
}
