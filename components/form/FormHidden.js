import {useEffect} from "react";

export default function FormHidden({fieldConfig, parentOnChange}){

    useEffect(()=>{
        parentOnChange({
            name: fieldConfig.name,
            value: fieldConfig.value,
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
            />
        </>

    )
}
