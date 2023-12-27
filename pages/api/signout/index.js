import {setCookie, getCookie} from "cookies-next";
import {USERID, addDays} from "@/services/AppService";

export default function (req, res) {

    let success = true;
    let message = 'Successful logout.';

    // let userId = encryptionService.encrypt(resp._id)
    let date = new Date()
    let expirationDate = addDays(date,-1);
    let options = {
        req,
        res,
        expires: expirationDate
    }
    setCookie(USERID, '', options);

    res.status(200).json({
        success: success,
        message: message,
    })

}
