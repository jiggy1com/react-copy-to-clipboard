import {MongoDBService} from "@/services/MongoDBService";
import {hashPassword} from "@/services/StringHelpers";
import {isValidPassword} from "@/services/StringHelpers";
import {setCookie} from "cookies-next";
import {USERID} from "@/services/AppService";
import {EncryptionService} from "@/services/EncryptionService";

export default function (req, res){

    let service = new MongoDBService();
    let encryptionService = new EncryptionService()

    function addDays(date, days) {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }

    function sendEmail(){

    }

    function validateEmail(){

    }

    // password validation
    function validatePassword(password){
        return isValidPassword(password)
    }

    let oIsValidPassword = validatePassword(req.body.password);

    if(!oIsValidPassword.success){
        res.status(200).json({
            success: false,
            message: oIsValidPassword.message,
        })
    }

    // try to create account

    if(validatePassword(req.body.password)){
        let oPasswordHash = hashPassword(req.body.password);
        let payload = {
            email: req.body.email,
            password: oPasswordHash.passwordHash,
            salt: oPasswordHash.salt,
            localStorage: req.body.localStorage
        }

        service.createAccount(payload).then((resp)=>{

            sendEmail()

            let userId = encryptionService.encrypt(resp.userId)
            let date = new Date()
            let expirationDate = addDays(date,30);
            let options = {
                req,
                res,
                expires: expirationDate
            }
            setCookie(USERID, userId, options);

            res.status(200).json({
                success: true,
                message: 'Account successfully created.',
                resp: resp,
            })
        }).catch((err)=>{
            res.status(200).json({
                success: false,
                message: err.message,
            })
        })

    }


}
