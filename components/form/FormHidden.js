import {useEffect} from "react";

export default function FormHidden({fieldConfig, parentOnChange}){

    useEffect(()=>{
        parentOnChange({
            name: fieldConfig.name,
            value: fieldConfig.defaultValue,
        })
    }, []);

    return (
        <>
            {fieldConfig.label.length > 0 &&
                <label>
                    {fieldConfig.label}
                </label>
            }
            <input
                id={fieldConfig.id}
                placeholder={fieldConfig.placeholder}
                type={fieldConfig.type}
                name={fieldConfig.name}
                defaultValue={fieldConfig.defaultValue}
            />
        </>

    )
}
