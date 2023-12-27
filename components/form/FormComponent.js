import {useState} from "react";
import {FetchService} from "services/FetchService";
import {FormMapFields} from "components/form/FormMapFields";

// example of formConfig
const formConfig = {
    action: '', // where to post
    submitText: '',
    fields: [
        // {
        //     id: '',
        //     placeholder: '',
        //     label: '',
        //     name: '',
        //     value: '',
        //     type: 'text', // text, number, select
        //     validation: function(){
        //         return true
        //     },
        //     colClass: 'col-12 col-6',
        // }
    ]
}

export default function FormComponent({formConfig}){

    const [formSuccess, setFormSuccess] = useState(false);
    const [formMessage, setFormMessage] = useState(null)
    const [formData, setFormData] = useState({});
    const config = formConfig;
    const fetchService = new FetchService();

    function handleOnChange(obj){
        setFormData(formData => ({
            ...formData,
            [obj.name]: obj.value
        }))
        console.log('FormComponent:handleOnChange', [obj.name], obj.value, formData);
    }

    function handleOnKeyUp(e){
        if(e.key === 'Enter'){
            if(handleOnKeyUp && typeof handleOnKeyUp === 'function'){
                handleOnSubmit(e);
            }
        }
    }

    function handleOnSubmit(e){
        e.preventDefault();
        e.stopPropagation();

        // clear message
        setFormMessage("");

        let formValidation = isValidForm()

        if(formValidation.success){
            fetchService.doPost(config.action, formData).then((res)=>{
                // console.log('fetchService res', res);
                setFormSuccess(res.success);
                setFormMessage(res.message);
                if(res.success && typeof config.successHandler === 'function'){
                    config.successHandler()
                }
            }).catch((err)=>{
                // console.error('fetchService err', err);
                setFormSuccess(false);
                setFormMessage(err);
            });
        }else{
            setFormSuccess(false)
            setFormMessage(formValidation.message)
        }


        return false;
    }

    function isValidForm(){
        console.warn('isValidForm')
        let isValid = true;
        let message = '';
        config.fields.forEach((field)=>{
            console.log('field', field);
            if(isValid){
                if(typeof field.validation === 'function'){
                    console.log('checking validation', formData[field.name])
                    let fieldValidation = field.validation(formData[field.name] ?? '');
                    console.log('fieldValidation', fieldValidation);
                    if(!fieldValidation.success){
                        isValid = false
                        message = fieldValidation.message;
                        console.log('ALL DONE CHECKING')
                    }
                }
            }
        })
        let ret = {
            success: isValid,
            message: message,
        };
        console.log('ret', ret)
        return ret;
    }

    return (

        <form onSubmit={handleOnSubmit}>

            {formMessage &&
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-12"}>
                            {formSuccess && formMessage &&
                                <div className={"alert alert-success"}>
                                    {formMessage}
                                </div>
                            }

                            {!formSuccess && formMessage &&
                                <div className={"alert alert-danger"}>
                                    {formMessage}
                                </div>
                            }
                        </div>
                    </div>
                </div>

            }

            <div className={"container"}>
                <div className={"row"}>

                    <FormMapFields
                        fields={config.fields}
                        handleOnChange={handleOnChange}
                        handleOnKeyUp={handleOnKeyUp}>
                    </FormMapFields>

                    <div className={"col-12"}>
                        <button className={"btn btn-primary"}>
                            {config.submitText}
                        </button>
                    </div>

                </div>
            </div>

        </form>
    )
}
