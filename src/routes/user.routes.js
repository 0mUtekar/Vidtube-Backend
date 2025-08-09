import { userController, loginUser , logoutUser , updateUsername, updatePassword, updateProfile_picture, updateBio, loggedInUser } from "../controllers/user.controllers.js";
import { Router } from "express";
import { uploadMediaToCloudinary } from "../middleware/cloudinaryMiddleware.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.route('/register').post(uploadMediaToCloudinary, userController);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/update-username').put(verifyJWT, updateUsername);
router.route('/update-password').put(verifyJWT, updatePassword);
router.route('/update-profile-picture').put(verifyJWT, uploadMediaToCloudinary, updateProfile_picture);
router.route('/update-bio').put(verifyJWT, updateBio);
router.route('/me').get(verifyJWT, loggedInUser);

export { router };