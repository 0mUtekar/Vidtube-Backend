import { Router } from "express";
import { userController } from "../controllers/user.controllers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const router = Router();
router.route('/register').post(
    uploadOnCloudinary.fields([
        {name: 'profile_picture', maxCount: 1},
    ]),
    userController);

export { router };