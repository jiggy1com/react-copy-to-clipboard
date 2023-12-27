export function FormSelectItem({option, formSelectOnChangeHandler}){

    function handleOnChange(e){
        formSelectOnChangeHandler(e);
    }

    return (
        <>
            <option selected={option.selected} value={option.value}>
                {option.label}
            </option>
        </>
    )
}
