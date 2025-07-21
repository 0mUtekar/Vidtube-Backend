import { Router } from "express";
import { createChannel, getChannel } from '../controllers/channel.controllers.js';
import {verifyJWT} from '../middleware/verifyJWT.js';
import {uploadOnCloudinary} from '../middleware/uploadimage.js';

const router = Router();

router.route('/create').post(verifyJWT, uploadOnCloudinary, createChannel);
router.route('/:channelName').get(getChannel);

export {router};