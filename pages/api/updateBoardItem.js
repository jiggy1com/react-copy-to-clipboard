import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function UpdateBoardItem(req, res){

    let mongodbService = new MongoDBService();
    let encryptionService = new EncryptionService();
    let cookieUserId = Cookies(req).get(USERID)
    let userId = encryptionService.decrypt(cookieUserId);
    mongodbService.setUserId(userId);

    if(!cookieUserId){
        res.status(200).json({
            success: false,
            message: 'User is not logged in.',
            data: []
        })
    }

    let payload = {
        boardItemId: req.body.boardItemId,
        newValue: req.body.newValue
    }

    return mongodbService.updateBoardItem(payload).then((resp)=>{
        console.log('updateBoardItem', resp);
        res.status(200).json({
            success: true,
            data: resp,
        })
    })


}
