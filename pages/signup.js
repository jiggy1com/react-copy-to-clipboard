import FormComponent from "@/components/form/FormComponent";
import {EmailFormModel, HiddenFormModel, PasswordFormModel, TextFormModel} from "@/models/InputModel";
import {isValidPassword} from "@/services/StringHelpers";
import {UserService} from "@/services/UserService";
import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";





export default function SignUp({testing}){

    const formConfig = {
        action: '/api/createaccount',
        submitText: 'Submit',
        successHandler: successHandler,
        fields: [
            new EmailFormModel({
                id: 'email',
                placeholder: 'Email',
                label: '',
                name: 'email',
                value: '',
                // validation: function(){
                //     return {
                //         success: true,
                //         message: 'no message',
                //     }
                // },
                colClass: 'col-12 mb-3',
            }),
            new PasswordFormModel({
                id: 'password',
                placeholder: 'Password',
                label: '',
                name: 'password',
                value: '',
                validation: isValidPassword,
                colClass: 'col-12 mb-3',
            }),
            new HiddenFormModel({
                id: 'localStorage',
                name: 'localStorage',
                defaultValue: '',
            })
        ]
    }

    const [localFormConfig, setLocalFormConfig] = useState(formConfig);
    const [ready, setReady] = useState(false);

    useEffect(()=>{
        const cp = new CopyPasteService()
        console.log('formConfig', formConfig)
        let config = Object.assign({}, formConfig)
        cp.getBoards().then((boards)=>{
            config.fields[2].defaultValue = boards
            setLocalFormConfig(config);
            setReady(true);
        })

    }, ['ready'])

    function successHandler(){
        window.location.href = '/';
    }

    function renderForm(){
        if(!ready){
            return (<></>)
        }
        return (
            <FormComponent formConfig={localFormConfig} />
        )
    }

    return (
        <div className={"container-fluid mt-5 mb-5"}>
            <div className={"row justify-content-md-center"}>
                <div className={"col-12 col-md-6 col-lg-4"}>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            Create Account
                        </div>
                        <div className={"card-body"}>
                            {renderForm()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const {req, query, res, asPath, pathname } = context;
    let userService = new UserService(req);
    return {
        props: {
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
