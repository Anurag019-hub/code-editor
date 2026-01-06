import UserModel from "../models/User.model.js"

export const CreateUserService = async (data) =>{
    const {email,password} = data;
    if(!email||!password){
        throw new Error("Email and Password are required");
    }
    if(password.length<6){
        throw new Error("Password must be 6 charater long")
    }
    const existingUser =await UserModel.findOne({email});
    if(existingUser){
        throw new Error("Email already in use");
    }
    const HashPass = await UserModel.hashPassword(password);
    const user =await UserModel.create({email,password:HashPass});
    user.password = undefined;
    const token = user.generateJWT();
    return {user,token};
}
