
import Cookies from "cookies";

export class UserService{
    constructor(req=null) {
        this.cookieManager = Cookies(req);
    }

    getManager(){
        // this.cookieManager = Cookies()
        return this.cookieManager
    }

    isLoggedIn(){
        return this.getManager().get('userId')
    }

}
