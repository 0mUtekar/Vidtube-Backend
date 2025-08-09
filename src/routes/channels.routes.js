import { Router } from "express";
import { createChannel, getChannel , subscribeTo, unsubscribeFrom, updateBanner, getSubscribersCount, getSubscribers, updateChannelName } from '../controllers/channel.controllers.js';
import {verifyJWT} from '../middleware/verifyJWT.js';
import { uploadMediaToCloudinary } from '../middleware/cloudinaryMiddleware.js';

const router = Router();

router.route('/create').post(verifyJWT, uploadMediaToCloudinary, createChannel);
router.route('/:channelName').get(getChannel);
router.route('/:channelName/subscribe').post(verifyJWT, subscribeTo);
router.route('/:channelName/unsubscribe').post(verifyJWT, unsubscribeFrom);
router.route('/:channelName/updatebanner').put(verifyJWT, uploadMediaToCloudinary, updateBanner);
router.route('/:channelName/subscribers').get(getSubscribers);
router.route('/:channelName/updatename').put(verifyJWT, updateChannelName);
router.route('/:channelName/subscribers/count').get(getSubscribersCount);

export {router};