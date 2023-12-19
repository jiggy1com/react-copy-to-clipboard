import {MongoDBService} from "@/services/MongoDBService";
import Cookies from "cookies";
import {EncryptionService} from "@/services/EncryptionService";
import {USERID} from "@/services/AppService";

export default function CreateBoardItem(req, res){

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
        _id: req.body._id,
        text: req.body.text,
    }

    return mongodbService.addBoardItemToBoard(payload).then((resp)=>{
        console.log('addBoardItemToBoard', resp);
        res.status(200).json({
            success: true,
            data: resp,
        })
    })


}
