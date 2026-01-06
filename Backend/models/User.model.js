import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'email must be greater than 6 charaters'],
        maxLength: [50, 'email cannot be more than 50 charaters']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],

    }
});
UserSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateJWT = function () {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
}

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;