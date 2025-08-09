import { Router } from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { likeVideo, unlikeVideo, getLikesCount, getLikes } from '../controllers/likes.controllers.js';

const router = Router();

router.route('/:video_id/likevideo').post(verifyJWT, likeVideo);
router.route('/:video_id/unlike').post(verifyJWT, unlikeVideo);
router.route('/:video_id/likesCount').get(getLikesCount);
router.route('/:video_id/likes').get(getLikes);

export { router };