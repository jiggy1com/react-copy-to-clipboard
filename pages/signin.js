import FormComponent from "@/components/form/FormComponent";
import FormText from "@/components/form/FormText";
import {EmailFormModel, PasswordFormModel, TextFormModel} from "@/models/InputModel";
import {FetchService} from "@/services/FetchService";
import {isValidPassword} from "@/services/StringHelpers";
import Cookies from 'cookies'
import {USERID} from "@/services/AppService";
// const http = new FetchService();
// const options = {
//     mode: 'cors',
//     credentials: 'include',
// }
const formConfig = {
    action: '/api/signin',
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
            // validation: isValidPassword,
            colClass: 'col-12',
        })
    ]
}

export default function SignIn({testing, serverSideCookies}){
    return (
        <div className={"container"}>
            <div className={"row justify-content-md-center"}>
                <div className={"col-12 col-md-6 col-lg-4"}>
                    <div className={"card"}>
                        <div className={"card-header"}>
                            Sign In
                        </div>
                        <div className={"card-body"}>
                            cookie: {JSON.stringify(serverSideCookies)}
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

    // Create a cookies instance
    const cookies = new Cookies(req, res)

    // Get a cookie
    cookies.get(USERID)

    // Set a cookie
    // cookies.set('myCookieName', 'some-value', {
    //     httpOnly: true, // true by default
    // })

    // Delete a cookie
    // cookies.set('myCookieName')

    return {
        props: {
            testing: '',
            serverSideCookies: cookies.get(USERID),
            // dsn: fullRes.dsn,
            // cart: []
        }
    }
}

