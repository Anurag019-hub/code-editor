import { validationResult } from "express-validator";
import { CreateUserService, LoginUserService } from "../Services/User.services.js";


export const CreateUserController = async (req, res) => {
    const result = validationResult(req);
    //checking for errors from express validator(if any)
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }

    try {
        const { user, token } = await CreateUserService(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}


export const LoginUserController = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
    }

    try {
        const { user, token } = await LoginUserService(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const ProfileController = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).send({ error: "Unauthorized User" });
    } else {
        res.status(200).send({ user });
    }

}

export const LogoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        await redisClient.set('token', token, { EX: 60 * 60 * 24 });
        res.status(200).json({
            message: 'Logged Out Successfully'
        });
    } catch (error) {
        req.status(400).send(error.message);
    }

}

export const FriendRequestController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (senderId.equals(receiverId)) {
        return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    try {
        const request = await FriendRequestService({
            sender: senderId,
            receiver: receiverId
        });

        return res.status(201).json({
            message: "Friend request sent successfully",
            request
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Friend request already pending"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

