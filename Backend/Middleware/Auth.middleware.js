import jwt from "jsonwebtoken";
import redisClient from "../Services/Redis.services.js";

export const authUserMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
