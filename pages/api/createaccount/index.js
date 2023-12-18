import {MongoDBService} from "@/services/MongoDBService";
import {hashPassword} from "@/services/StringHelpers";

export default function (req, res){

    let service = new MongoDBService();

    function validateEmail(){

    }

    function validatePassword(){

    }

    function sendEmail(){

    }

    let oPasswordHash = hashPassword(req.body.password);
    let data = {
        email: req.body.email,
        password: oPasswordHash.passwordHash,
        salt: oPasswordHash.salt
    }

    service.createAccount(data).then(()=>{

        sendEmail()

        res.status(200).json({
            success: true,
            message: 'Account successfully created.',
        })
    })
}
