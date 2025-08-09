import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Like } from "../models/likes.models.js";

const likeOwnership = (like, userID) => {
    if (!like || !userID) {
        throw new APIerror(400, "Like or user ID is required");
    }
    const likeOwnerId = like.owner._id || like.owner;
    if (likeOwnerId.toString() !== userID.toString()) {
        throw new APIerror(403, "You are not the owner of this like");
    }
};

const likeVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const user_id = req.user?._id;

    if (!video_id) throw new APIerror(400, "Video ID is required");
    if (!user_id) throw new APIerror(400, "User ID is required");

    if (!mongoose.Types.ObjectId.isValid(video_id)) {
        throw new APIerror(400, "Invalid video ID format");
    }

    const existingLike = await Like.findOne({
        video_id: video_id,
        owner: user_id   
    });

    if (existingLike) throw new APIerror(400, "You have already liked this video");

    const like = await Like.create({
        video_id: video_id, 
        owner: user_id
    });

    res.status(201).json(new APIresponse(201, "Video liked successfully", like));
});

const unlikeVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const user_id = req.user?._id;

    if (!video_id) throw new APIerror(400, "Video ID is required");
    if (!user_id) throw new APIerror(400, "User ID is required");

    if (!mongoose.Types.ObjectId.isValid(video_id)) {
        throw new APIerror(400, "Invalid video ID format");
    }

    const like = await Like.findOne({
        video_id: video_id,
        owner: user_id
    });

    if (!like) throw new APIerror(404, "Like not found");

    likeOwnership(like, user_id);

    await Like.deleteOne({ _id: like._id });

    res.status(200).json(new APIresponse(200, "Video unliked successfully"));
});

const getLikes = asyncHandler(async (req, res) => {
    const { video_id } = req.params;

    if (!video_id) throw new APIerror(400, "Video ID is required");

    if (!mongoose.Types.ObjectId.isValid(video_id)) {
        throw new APIerror(400, "Invalid video ID format");
    }

    const likes = await Like.find({ video_id: video_id })
        .populate("owner", "username");

    if (!likes || likes.length === 0) {
        return res.status(200).json(new APIresponse(200, "No likes found for this video", []));
    }

    res.status(200).json(new APIresponse(200, "Likes retrieved successfully", likes));
});

const getLikesCount = asyncHandler(async (req, res) => {
    const { video_id } = req.params;

    if (!video_id) throw new APIerror(400, "Video ID is required");

    if (!mongoose.Types.ObjectId.isValid(video_id)) {
        throw new APIerror(400, "Invalid video ID format");
    }

    const count = await Like.countDocuments({ video_id: video_id });

    res.status(200).json(new APIresponse(200, "Likes count retrieved successfully", { count }));
});

export { likeVideo, unlikeVideo, getLikes, getLikesCount };