import { Router } from "express";
import { postVideo, getVideo, deleteVideo, updateThumbnail, changeVisibility, veiwVideo } from "../controllers/videos.controllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { uploadMediaToCloudinary } from "../middleware/cloudinaryMiddleware.js";

const router = Router();

router.route('/').post(verifyJWT, uploadMediaToCloudinary, postVideo);
router.route('/:video_id').get(getVideo);
router.route('/:video_id').delete(verifyJWT, deleteVideo);
router.route('/:video_id/thumbnail').patch(verifyJWT, uploadMediaToCloudinary, updateThumbnail);
router.route('/:video_id/visibility').patch(changeVisibility);
router.route('/:video_id/view').post(veiwVideo);

export { router };