import UserModel from "../models/User.model.js"
import FriendRequestModel from "../models/FriendRequest.model.js";

export const CreateUserService = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error("Email and Password are required");
    }
    if (password.length < 6) {
        throw new Error("Password must be 6 charater long")
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("Email already in use");
    }
    const HashPass = await UserModel.hashPassword(password);
    const user = await UserModel.create({ email, password: HashPass });
    user.password = undefined;
    const token = user.generateJWT();
    return { user, token };
}


export const LoginUserService = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error("Email and Password are required");
    }
    if (password.length < 6) {
        throw new Error("Email or Password is incorrect");
    }
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
        throw new Error("Email or password is incorrect");
    }
    const CheckPassword = await user.isValidPassword(password);
    user.password = undefined;
    if (CheckPassword) {
        const token = user.generateJWT();
        return { user, token };
    } else {
        throw new Error("Email or Password is Incorrect");
    }
}

export const FriendRequestService = async ({ senderId, receiverId }) => {
  if (senderId.equals(receiverId)) {
    throw new Error("Cannot send friend request to yourself");
  }

  const receiverExists = await UserModel.exists({ _id: receiverId });
  if (!receiverExists) {
    throw new Error("Receiver does not exist");
  }

  try {
    return await FriendRequestModel.create({
      sender: senderId,
      receiver: receiverId,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Friend request already pending");
    }
    throw err; 
  }
};
