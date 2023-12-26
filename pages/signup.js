import FormComponent from "@/components/form/FormComponent";
import {EmailFormModel, PasswordFormModel, TextFormModel} from "@/models/InputModel";
import {isValidPassword} from "@/services/StringHelpers";
import {UserService} from "@/services/UserService";

const formConfig = {
    action: '/api/createaccount',
    submitText: 'Submit',
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
            colClass: 'col-12',
        }),
        new PasswordFormModel({
            id: 'password',
            placeholder: 'Password',
            label: '',
            name: 'password',
            value: '',
            validation: isValidPassword,
            colClass: 'col-12',
        })
    ]
}

export default function SignUp({testing}){
    return (
        <div className={"container-fluid mt-5"}>
            <div className={"row justify-content-md-center"}>
                <div className={"col-12 col-md-6 col-lg-4"}>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            Create Account
                        </div>
                        <div className={"card-body"}>
                            <FormComponent formConfig={formConfig} />
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
