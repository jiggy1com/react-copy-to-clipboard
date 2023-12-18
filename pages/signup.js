import FormComponent from "@/components/form/FormComponent";
import FormText from "@/components/form/FormText";
import {EmailFormModel, PasswordFormModel, TextFormModel} from "@/models/InputModel";
import {FetchService} from "@/services/FetchService";
import {isValidPassword} from "@/services/StringHelpers";

// const http = new FetchService();
// const options = {
//     mode: 'cors',
//     credentials: 'include',
// }
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
        <div className={"container"}>
            <div className={"row justify-content-md-center"}>
                <div className={"col-12 col-md-4"}>
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
    // isSecure = (req.headers.hasOwnProperty('x-forwarded-proto')
    //     && req.headers['x-forwarded-proto'] === 'https');
    // host = (isSecure ? 'https://' : 'http://') + req.headers.host;
    //
    // let fullRes = {
    //     dsn: '',
    //     cart: []
    // }
    //
    // await getParams().then((res)=>{
    //     fullRes.dsn = res.dsn
    // }).catch((err)=>{
    //     console.error('Cart:index:getParams:err', err);
    // });

    return {
        props: {
            testing: '',
            // dsn: fullRes.dsn,
            // cart: []
        }
    }
}

