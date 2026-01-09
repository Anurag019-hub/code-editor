import { Router } from "express";
import { body } from "express-validator";
import {
  CreateUserController,
  LoginUserController,
  ProfileController,
  LogoutController,
  FriendRequestController,
  GetAllFriendRequestController,
  AcceptRequestController,
} from "../Controllers/User.controllers.js";
import { authUserMiddleware } from "../Middleware/Auth.middleware.js";

const UserRoute = Router();


UserRoute.post(
  "/create",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isString().withMessage("Password must be a string")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  CreateUserController
);

UserRoute.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").isString().withMessage("Password must be a string"),
  LoginUserController
);

UserRoute.get(
  "/profile",
  authUserMiddleware,
  ProfileController
);

UserRoute.post(
  "/logout",
  authUserMiddleware,
  LogoutController
);


UserRoute.post(
  "/friend-request/send",
  authUserMiddleware,
  body("receiverId")
    .isMongoId()
    .withMessage("receiverId must be a valid user id"),
  FriendRequestController
);

UserRoute.get(
  "/friend-request",
  authUserMiddleware,
  GetAllFriendRequestController
);

UserRoute.post(
  "/friend-request/accept",
  authUserMiddleware,
  body("requestId")
    .isMongoId()
    .withMessage("requestId must be a valid id"),
  AcceptRequestController
);

export default UserRoute;
