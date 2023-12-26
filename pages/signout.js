import {useEffect} from "react";
import cookieCutter from "cookie-cutter";
import {USERID} from "@/services/AppService";
import {UserService} from "@/services/UserService";

export default function SignOut(){




    // useEffect(()=>{
    //     // let key = USERID
    //     // let value = ''
    //     // let options = {
    //     //     expires: new Date(0)
    //     // }
    //     // cookieCutter().set(key, value, options);
    // },[])
    return (
        <div>
            Logout
        </div>
    )
}

export async function getServerSideProps({req}){

    let userService = new UserService(req);

    return {
        props:{
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
