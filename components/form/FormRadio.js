import {FormRadioItem} from "components/form/FormRadioItem";

export function FormRadio({fieldConfig, parentOnChange}){

    function formRadioOnChangeHandler(e){
        if(e.target.checked){
            parentOnChange({
                name: e.target.name,
                value: e.target.value
            });
        }

        if(typeof fieldConfig.onChangeCallback === 'function'){
            // console.log('onChangeCallback firing');
            fieldConfig.onChangeCallback(e)
        }
    }

    return (
        <>

            <div className={"form-group"}>
                {fieldConfig.label &&
                    <label>
                        {fieldConfig.label}
                    </label>
                }
                {fieldConfig.options.map((option, idx)=>{
                    return (
                        <FormRadioItem
                            key={idx}
                            option={option}
                            formRadioOnChangeHandler={formRadioOnChangeHandler}>
                        </FormRadioItem>
                    )
                })}
            </div>
        </>
    )
}
