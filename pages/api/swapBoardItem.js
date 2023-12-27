import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function SwapBoardItem(req, res){

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
        fromId: req.body.fromId,
        toId: req.body.toId,
        fromIdx: req.body.fromIdx,
        toIdx: req.body.toIdx
    }

    return mongodbService.swapBoardItem(payload).then((resp)=>{
        console.log('swapBoardItem', resp);
        res.status(200).json({
            success: true,
            data: resp,
        })
    })


}
