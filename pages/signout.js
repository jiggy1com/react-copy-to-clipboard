import {useEffect} from "react";
import cookieCutter from "cookie-cutter";
import {USERID} from "@/services/AppService";
import {UserService} from "@/services/UserService";
import {useRouter} from "next/router";
import {FetchService} from "@/services/FetchService";
import {FaSpinner} from "react-icons/fa6";

export default function SignOut({isLoggedIn}){

    const router = useRouter();

    function doLogout(){
        let f = new FetchService()
        f.doGet('/api/signout').then((res)=>{
            if(res.success){
                window.location.href = '/'
            }
        })
        return <></>
    }

    return (
        <div className={"container-fluid mt-5 mb-5"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1>
                        <FaSpinner className={"spin"} /> Signing you out...
                    </h1>
                </div>
            </div>

            {doLogout()}
        </div>
    )
}

export async function getServerSideProps({req}){

    // const {req, query, res, asPath, pathname } = context;

    let userService = new UserService(req);

    if(!userService.isLoggedIn()){
        return {
            redirect: {
                destination: '/'
            }
        }
    }

    // userService.logout()

    return {
        props:{
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
