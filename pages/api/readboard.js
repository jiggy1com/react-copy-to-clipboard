import {MongoDBService} from "@/services/MongoDBService";
import {EncryptionService} from "@/services/EncryptionService";
import Cookies from "cookies";
import {USERID} from "@/services/AppService";

const service = new MongoDBService();

export default async (req, res) => {

    try{

        let mongodbService = new MongoDBService();
        let encryptionService = new EncryptionService();
        let cookieUserId = req.body.cookieUserId //Cookies(req).get(USERID)

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
        }

        mongodbService.getBoardByUserId(payload).then((resp)=>{
            res.status(200).json({
                success: true,
                data: resp,
            })
        }).catch((err)=>{
            res.status(200).json({
                success: false,
                err: err
            })
        })

    }catch(err){
        console.log('CATCH:ERR', err)
        res.status(200).json({
            success: false,
            message: err.message
        })
    }



};
