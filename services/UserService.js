
import Cookies from "cookies";
import {USERID} from "@/services/AppService";

export class UserService{
    constructor(req=null) {
        this.cookieManager = Cookies(req);
    }

    getManager(){
        // this.cookieManager = Cookies()
        return this.cookieManager
    }

    isLoggedIn(){
        return typeof this.getManager().get(USERID) !== 'undefined'
    }

    getUserIdCookie(){
        return this.getManager().get(USERID) ?? null
    }

    logout(){
        let value = '';
        let options = {
            expires: new Date(0)
        }
        return this.getManager().set(USERID, value, options);
    }

}
