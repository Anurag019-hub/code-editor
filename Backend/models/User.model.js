import mongoose from 'mongoose';
import bcrypt from'bcrypt';
import jwt from'jsonwebtoken';

const UserSchema =new  mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6,'email must be greater than 6 charaters'],
        maxLength:[50,'email cannot be more than 50 charaters']
    },
    password:{
        type:String,
        require:true,
        select:false,
    },
    friends:{
       type: [mongoose.Schema.Types.ObjectId],
       ref: User,
       default:[],
       
    }
});
UserSchema.static.hashPassword = async (password) =>{
    return await bcrypt.hash(password,10);
}

UserSchema.method.isValidPassword = async () =>{
    return await bcrypt.compare(password,this.password);
}

UserSchema.method.generateJWT = async () =>{
    return  jwt.sign({email:this.email},process.env.JWT_SECRET_KEY,{expiresIn:'24h'});
}

const UserModel = mongoose.model('User',UserSchema);
export default UserModel;