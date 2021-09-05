import express ,{Request, Response} from 'express';
import router from '../config/route';

import fs from 'fs';
import path from "path";

import { UserClass_all } from '../models/json_model/jsonModel';
import { search_User, add_User } from '../repository/userRepo';
import { get_userJSONData } from '../models/json_model/jsonModel_user';
import logger from '../config/logger';


const UserRouter = router;

UserRouter.get('/', async(req: Request, res: Response)=>{
    res.status(200).send({
        message: "hello"
    });
});

UserRouter.post('/v1/user/login', async(req: Request, res: Response)=>{    
    const userSocial: String = JSON.stringify(req.query.user_social);
    const userEmail: String = req.body.user_email;
    const userToken: String = req.body.user_token;
    
    try {
        let result:any = await search_User(userEmail, userToken, userSocial);   
        logger.info(result);
        if(result.rowCount > 0){
            res.status(200).send({
                success: true,
                result : result.rows
            });
        }else{
            res.status(400).send({
                success: false,
                message: "Resource Null"
            });
        } 
    } catch (err) {      
        logger.error("point 1",err);
        res.status(500).send({
            success: false,
            message: "Server Error"
        });
    }
});

UserRouter.post('/v1/user/signup', async (req: Request, res: Response)=>{
    const userSocial: String = JSON.stringify(req.query.user_social);
    const userEmail: String = req.body.user_email;
    const userToken: String = req.body.user_token;
    const userNickname: String = req.body.user_nickname;

    const res_add_User = add_User(userEmail, userNickname, userToken, userSocial);
    
    res.status(200).send({
        success: true,
        result: res_add_User
    });
});

export default UserRouter;