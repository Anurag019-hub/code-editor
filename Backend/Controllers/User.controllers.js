import mongoose from "mongoose";
import { validationResult } from "express-validator";
import {
  CreateUserService,
  LoginUserService,
  FriendRequestService,
  GetAllFriendRequestServices,
  AcceptRequestServices
} from "../Services/User.services.js";
import redisClient from "../Services/Redis.services.js";

export const CreateUserController = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const { user, token } = await CreateUserService(req.body);
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const LoginUserController = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const { user, token } = await LoginUserService(req.body);
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const ProfileController = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  return res.status(200).json({ user: req.user });
};


export const LogoutController = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "Token not found" });
    }

    await redisClient.set(token, "blacklisted", {
      EX: 60 * 60 * 24,
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const FriendRequestController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const senderId = req.user._id;
  const { receiverId } = req.body;

  try {
    const request = await FriendRequestService({
      senderId,
      receiverId,
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      request,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const GetAllFriendRequestController = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await GetAllFriendRequestServices(userId);

    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const AcceptRequestController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { requestId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: "Invalid request id" });
  }

  try {
    await AcceptRequestServices({ requestId, userId });

    return res.status(200).json({
      message: "Friend request accepted",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
