import { userController, loginUser , logoutUser , updateUsername, updatePassword, updateProfile_picture, updateBio } from "../controllers/user.controllers.js";
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
router.route('/update-username').put(verifyJWT, updateUsername);
router.route('/update-password').put(verifyJWT, updatePassword);
router.route('/update-profile-picture').put(verifyJWT, uploadOnCloudinary, updateProfile_picture);
router.route('/update-bio').put(verifyJWT, updateBio);

export { router };