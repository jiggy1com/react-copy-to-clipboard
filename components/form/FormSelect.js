import {FormSelectItem} from "components/form/FormSelectItem";
import {useEffect} from "react";

export function FormSelect({fieldConfig, parentOnChange}){

    // TODO: remove
    // this is a temporary solution until the defaultValue solution can be implemented
    useEffect(()=>{
        fieldConfig.options.forEach((option)=>{
            if(option.selected){
                parentOnChange({
                    name: fieldConfig.name,
                    value: option.value,
                })
            }
        })
    }, [])

    function formSelectOnChangeHandler(){

    }

    function handleOnChange(e){
        // update form config
        fieldConfig.options.forEach((option)=>{
            option.selected = (option.value === e.target.value)
        });

        // call parent handler
        parentOnChange({
            name: fieldConfig.name,
            value: e.target.value,
        })
    }

    function getSelectedValue(){
        let selectedOption = fieldConfig.options.filter((option)=>{
            return option.selected === true;
        });

        return selectedOption.length
            ? selectedOption[0].value
            : '';
    }

    return (
        <>
            <div className={"form-group"}>

                {fieldConfig.label.length > 0 &&
                    <label>
                        {fieldConfig.label}
                    </label>
                }

                <select
                    id={fieldConfig.id}
                    name={fieldConfig.name}
                    value={getSelectedValue()}
                    className={"form-control"}
                    onChange={handleOnChange}>
                    {fieldConfig.options.map((option, idx)=>{
                        return (
                            <FormSelectItem
                                key={idx}
                                option={option}
                                formSelectOnChangeHandler={formSelectOnChangeHandler} />
                        )
                    })}
                </select>
            </div>
        </>
    )

}
