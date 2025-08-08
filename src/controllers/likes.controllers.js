import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Like } from "../models/likes.models.js";

const likeVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    const user_id = req.user?._id;

    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    if (!user_id) {
        throw new APIerror(400, "User ID is required");
    }

    const existingLike = await Like.findOne({ video_id, user_id });
    if (existingLike) {
        throw new APIerror(400, "You have already liked this video");
    }

    const like = await Like.create({ video_id, user_id });
    res.status(201).json(new APIresponse(like, "Video liked successfully"));
})

const unlikeVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    const user_id = req.user?._id;

    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    if (!user_id) {
        throw new APIerror(400, "User ID is required");
    }

    const like = await Like.findOneAndDelete({ video_id, user_id });
    if (!like) {
        throw new APIerror(404, "Like not found");
    }

    res.status(200).json(new APIresponse(null, "Video unliked successfully"));
})

const getLikes = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;

    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }

    const likes = await Like.find({ video_id }).populate('user_id', 'name');
    if (!likes || likes.length === 0) {
        throw new APIerror(404, "No likes found for this video");
    }

    res.status(200).json(new APIresponse(likes, "Likes retrieved successfully"));
})

const getLikesCount = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;

    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }

    const count = await Like.countDocuments({ video_id });
    res.status(200).json(new APIresponse(count, "Likes count retrieved successfully"));
})

export { likeVideo, unlikeVideo, getLikes, getLikesCount };