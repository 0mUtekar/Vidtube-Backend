import { userController, loginUser, generateTokens , loggedInUser , logoutUser } from "../controllers/user.controllers.js";
import { Router } from "express";
import { uploadOnCloudinary } from "../middleware/uploadimage.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
const router = Router();
router.route('/register').post(
    uploadOnCloudinary,
    userController
);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
export { router };