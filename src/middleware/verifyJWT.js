import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { APIerror } from "../utils/APIerror.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];// Check for token in cookies or Authorization header [The part after "Bearer "]
    
    if (!token) {
        throw new APIerror(401, "Access token is required");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new APIerror(404, "Invalid user");
        }
        req.user = user; // Attach user to request object
        next();
    }
    catch (error) {
        throw new APIerror(401, "Invalid or expired access token", error);
    }
})

export { verifyJWT };