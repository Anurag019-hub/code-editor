import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [6, "Email must be at least 6 characters"],
      maxlength: [50, "Email cannot exceed 50 characters"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


UserSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};


UserSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
