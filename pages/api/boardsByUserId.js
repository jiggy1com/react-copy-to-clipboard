import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function BoardsByUserId(req, res){

    let mongodbService = new MongoDBService();
    let encryptionService = new EncryptionService();
    let cookieUserId = Cookies(req).get(USERID)

    if(!cookieUserId){
        res.status(200).json({
            success: false,
            message: 'User is not logged in.',
            data: []
        })
    }

    let userId = encryptionService.decrypt(cookieUserId);

    return mongodbService.getBoardsByUserId(userId).then((resp)=>{
        res.status(200).json({
            success: true,
            data: resp,
            // userId: userId,
        })
    })


}
