import { validationResult } from "express-validator";

export const CreateUserController = async(req,res)=>{
    const result = validationResult(req);
    //checking for errors from express validator(if any)
    if(!result.isEmpty()){
        res.status(400).json({errors:result.array()});
    }

    try{
        const {user , token} = await CreateUserServices(req.body);
        res.status(201).json({user , token});
    }catch(error){
        res.status(400).send(error.message);
    }
}

