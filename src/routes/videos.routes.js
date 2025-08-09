import { Router } from "express";
import { postVideo, 
    getVideo, 
    deleteVideo, 
    updateThumbnail, 
    changeVisibility, 
    viewVideo,
    getAllVideos,
    getChannelVideos } from "../controllers/videos.controllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { uploadMediaToCloudinary } from "../middleware/cloudinaryMiddleware.js";

const router = Router();

router.route('/').post(verifyJWT, uploadMediaToCloudinary, postVideo);
router.route('/:video_id').get(getVideo);
router.route('/:video_id').delete(verifyJWT, deleteVideo);
router.route('/:video_id/thumbnail').patch(verifyJWT, uploadMediaToCloudinary, updateThumbnail);
router.route('/:video_id/visibility').patch(verifyJWT, changeVisibility);
router.route('/:video_id/view').put(viewVideo);
router.route('/').get(getAllVideos);
router.route('/channel/:channel_id').get(getChannelVideos);

export { router };