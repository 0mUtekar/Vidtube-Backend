import { Router } from "express";
import { createChannel, getChannel , subsribeTo, unsubscribeFrom, updateBanner, getSubscribersCount, getSubssribers } from '../controllers/channel.controllers.js';
import {verifyJWT} from '../middleware/verifyJWT.js';
import { uploadMediaToCloudinary } from '../middleware/cloudinaryMiddleware.js';

const router = Router();

router.route('/create').post(verifyJWT, uploadMediaToCloudinary, createChannel);
router.route('/:channelName').get(getChannel);
router.route('/:channelName/subscribe').post(verifyJWT, subsribeTo);
router.route('/:channelName/unsubscribe').post(verifyJWT, unsubscribeFrom);
router.route('/:channelName/updatebanner').put(verifyJWT, uploadMediaToCloudinary, updateBanner);
router.route('/:channelName/subscribers').get(getSubssribers);
router.route('/:channelName/subscribers/count').get(getSubscribersCount);

export {router};