import FormText from "components/form/FormText";
import FormHidden from "components/form/FormHidden";
import FormTextArea from "components/form/FormTextArea";
import {FormRadio} from "components/form/FormRadio";
import {FormSelect} from "components/form/FormSelect";

export function FormMapFields({fields, handleOnChange, handleOnKeyUp}){
    return (

        <>
            {fields.map((field, idx)=>{

                return (
                    <div key={idx} className={field.colClass}>
                        {(()=> {

                            switch(field.type){

                                case "text":
                                case "email":
                                case "password":
                                    return (
                                        <FormText
                                            fieldConfig={field}
                                            parentOnChange={handleOnChange}
                                            parentHandleOnKeyUp={handleOnKeyUp}>
                                        </FormText>
                                    )

                                case "hidden":
                                    return (
                                        <FormHidden
                                            fieldConfig={field}
                                            parentOnChange={handleOnChange}>
                                        </FormHidden>
                                    )

                                case "textarea":
                                    return (
                                        <FormTextArea
                                            fieldConfig={field}
                                            parentOnChange={handleOnChange}>
                                        </FormTextArea>
                                    )

                                case "radio":
                                    return (
                                        <FormRadio
                                            fieldConfig={field}
                                            parentOnChange={handleOnChange}>
                                        </FormRadio>
                                    )

                                case "select":
                                    return (
                                        <FormSelect
                                            fieldConfig={field}
                                            parentOnChange={handleOnChange}>
                                        </FormSelect>
                                    )

                                default:
                                    break;
                            }
                        })()}
                    </div>
                )

            })}

        </>


    )
}
