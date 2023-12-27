export default function FormTextArea({fieldConfig, parentOnChange}){

    function localOnChange(e){
        parentOnChange({
            name: e.target.name,
            value: e.target.value
        })
    }

    return (
        <div className={"form-group"}>
            {fieldConfig.label.length > 0 &&
                <label htmlFor={fieldConfig.id}>
                    {fieldConfig.label}
                </label>
            }
            <textarea
                id={fieldConfig.id}
                placeholder={fieldConfig.placeholder}
                name={fieldConfig.name}
                className={"form-control"}
                onChange={localOnChange}
                rows={"5"}>
            </textarea>
        </div>
    )
}
