import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function DeleteBoardItem(req, res){

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
        boardId: req.body.boardId,
        boardItemId: req.body.boardItemId,
    }

    return mongodbService.deleteBoardItem(payload).then((resp)=>{
        console.log('deleteBoardItem', resp);
        res.status(200).json({
            success: true,
            data: resp,
        })
    })


}
