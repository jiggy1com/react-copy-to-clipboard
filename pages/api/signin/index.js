import {MongoDBService} from "@/services/MongoDBService";
import {setCookie, getCookie} from "cookies-next";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID, addDays} from "@/services/AppService";

export default function (req, res) {

    let service = new MongoDBService();
    let encryptionService = new EncryptionService()

    let payload = {
        email: req.body.email,
        password: req.body.password
    }

    let success = true;
    let message = 'Successful login.';

    service.signin(payload).then((resp)=>{

        if(!resp){
            success = false;
            message = 'Invalid email and/or password.';
        }else{
            let userId = encryptionService.encrypt(resp._id)
            let date = new Date()
            let expirationDate = addDays(date,30);
            let options = {
                req,
                res,
                expires: expirationDate
            }
            setCookie(USERID, userId, options);
        }

        res.status(200).json({
            success: success,
            message: message,
            user: resp,
        })
    })

}
