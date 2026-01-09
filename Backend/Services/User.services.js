import mongoose from "mongoose";
import UserModel from "../models/User.model.js";
import FriendRequestModel from "../models/FriendRequest.model.js";

export const CreateUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await UserModel.hashPassword(password);
  const user = await UserModel.create({ email, password: hashedPassword });

  user.password = undefined;
  const token = user.generateJWT();

  return { user, token };
};

export const LoginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Email or Password is incorrect");
  }

  const isValid = await user.isValidPassword(password);
  if (!isValid) {
    throw new Error("Email or Password is incorrect");
  }

  user.password = undefined;
  const token = user.generateJWT();

  return { user, token };
};


export const FriendRequestService = async ({ senderId, receiverId }) => {
  if (senderId.equals(receiverId)) {
    throw new Error("Cannot send friend request to yourself");
  }

  const receiver = await UserModel.findById(receiverId);
  if (!receiver) {
    throw new Error("Receiver does not exist");
  }

  const sender = await UserModel.findById(senderId);
  if (!sender) {
    throw new Error("Sender does not exist");
  }

  if (sender.friends.includes(receiverId)) {
    throw new Error("Already friends");
  }

  const reverseRequest = await FriendRequestModel.findOne({
    sender: receiverId,
    receiver: senderId,
  });

  if (reverseRequest) {
    throw new Error("User has already sent you a friend request");
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


export const GetAllFriendRequestServices = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await FriendRequestModel.find({ receiver: userId })
    .populate("sender", "email name")
    .sort({ createdAt: -1 });
};


export const AcceptRequestServices = async ({ requestId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await FriendRequestModel.findById(requestId).session(session);
    if (!request) {
      throw new Error("Friend request not found");
    }

    if (!request.receiver.equals(userId)) {
      throw new Error("Not authorized to accept this request");
    }

    const { sender, receiver } = request;

    await UserModel.findByIdAndUpdate(
      receiver,
      { $addToSet: { friends: sender } },
      { session }
    );

    await UserModel.findByIdAndUpdate(
      sender,
      { $addToSet: { friends: receiver } },
      { session }
    );

    await FriendRequestModel.deleteOne({ _id: requestId }).session(session);

    await session.commitTransaction();
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
