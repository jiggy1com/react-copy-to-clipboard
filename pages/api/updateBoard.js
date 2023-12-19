import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function UpdateBoard(req, res){

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
        userId: userId,
        boardId: req.body.boardId,
        newValue: req.body.newValue
    }

    return mongodbService.updateBoard(payload).then((resp)=>{
        console.log('updateBoard', resp);
        res.status(200).json({
            success: true,
            data: resp,
        })
    })


}
