import { validationResult } from "express-validator";
import { CreateUserService } from "../Services/User.services.js";

export const CreateUserController = async(req,res)=>{
    const result = validationResult(req);
    //checking for errors from express validator(if any)
    if(!result.isEmpty()){
        res.status(400).json({errors:result.array()});
    }

    try{
        const {user , token} = await CreateUserService(req.body);
        res.status(201).json({user , token});
    }catch(error){
        res.status(400).send(error.message);
    }
}

