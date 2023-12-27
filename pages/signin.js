import FormComponent from "@/components/form/FormComponent";
import {EmailFormModel, PasswordFormModel, TextFormModel} from "@/models/InputModel";
import {UserService} from "@/services/UserService";
import {useRouter} from "next/router";

export default function SignIn(){

    const router = useRouter();

    const formConfig = {
        action: '/api/signin',
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
                // validation: isValidPassword,
                colClass: 'col-12 mb-3',
            })
        ]
    }

    function successHandler(){
        window.location.href = '/'
    }

    return (
        <div className={"container-fluid mt-5"}>
            <div className={"row justify-content-md-center"}>
                <div className={"col-12 col-md-6 col-lg-4"}>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            Sign In
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

    if(userService.isLoggedIn()){
        return {
            redirect: {
                destination: '/',
            }
        }
    }

    return {
        props: {
            // serverSideCookies: userService.getUserIdCookie(),
            isLoggedIn: userService.isLoggedIn()
            // dsn: fullRes.dsn,
            // cart: []
        }
    }
}


