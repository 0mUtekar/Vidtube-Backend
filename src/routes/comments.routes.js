import { Router } from 'express';
import { getComments, postComment, deleteComment, getCommentsCount } from '../controllers/comments.controllers.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = Router();

router.route('/:video_id/postComment').post(verifyJWT, postComment);
router.route('/:video_id/getComments').get(getComments);
router.route('/:video_id/deleteComment').delete(verifyJWT, deleteComment);
router.route('/:video_id/commentsCount').get(getCommentsCount);

export { router };