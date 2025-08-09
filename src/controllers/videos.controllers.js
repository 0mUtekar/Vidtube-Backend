import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Video } from "../models/video.models.js";
import { Channel } from "../models/channel.models.js";
import mongoose from "mongoose";

const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new APIerror(400, `Invalid ${fieldName} format`);
    }
};

const validateVideoOwnership = async (videoId, userId) => {
    validateObjectId(videoId, "video ID");

    const video = await Video.findById(videoId).populate("channel_id", "owner");
    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (video.channel_id.owner.toString() !== userId.toString()) {
        throw new APIerror(403, "You don't own this video");
    }

    return video;
};

const validateChannelOwnership = async (channelId, userId) => {
    validateObjectId(channelId, "channel ID");

    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw new APIerror(404, "Channel not found");
    }

    if (channel.owner.toString() !== userId.toString()) {
        throw new APIerror(403, "You don't own this channel");
    }

    return channel;
};

const postVideo = asyncHandler(async (req, res) => {
    const { channel_id, title, description, is_public = true } = req.body;
    const userId = req.user._id;

    if (!channel_id || !title) {
        throw new APIerror(400, "Channel ID and title are required");
    }
    if (title.trim().length > 100) {
        throw new APIerror(400, "Title cannot exceed 100 characters");
    }
    if (description?.trim().length > 500) {
        throw new APIerror(400, "Description cannot exceed 500 characters");
    }

    await validateChannelOwnership(channel_id, userId);

    const video_url = req.body?.cloudinaryUploads?.video?.[0]?.secure_url;
    const thumbnail_url = req.body?.cloudinaryUploads?.thumbnail?.[0]?.secure_url;

    if (!video_url) {
        throw new APIerror(400, "Video upload failed or missing");
    }
    if (!thumbnail_url) {
        throw new APIerror(400, "Thumbnail upload failed or missing");
    }

    const video = await Video.create({
        owner: userId,
        channel_id,
        title: title.trim(),
        description: description?.trim() || "",
        video_url,
        thumbnail_url,
        is_public: Boolean(is_public)
    });

    res.status(201).json(
        new APIresponse(201, "Video uploaded successfully", video)
    );
});

const getVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    validateObjectId(video_id, "video ID");

    const video = await Video.findById(video_id)
        .populate("channel_id", "name banner_url owner")
        .select("-__v");

    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (!video.is_public) {
        if (!req.user || video.channel_id.owner.toString() !== req.user._id.toString()) {
            throw new APIerror(403, "This video is private");
        }
    }

    res.status(200).json(
        new APIresponse(200, "Video retrieved successfully", video)
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const userId = req.user._id;

    await validateVideoOwnership(video_id, userId);
    await Video.findByIdAndDelete(video_id);

    res.status(200).json(
        new APIresponse(200, "Video deleted successfully", null)
    );
});

const updateThumbnail = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const userId = req.user._id;

    await validateVideoOwnership(video_id, userId);

    const thumbnail_url = req.body?.cloudinaryUploads?.thumbnail?.[0]?.secure_url;
    if (!thumbnail_url) {
        throw new APIerror(400, "Thumbnail upload failed or missing");
    }

    const video = await Video.findByIdAndUpdate(
        video_id,
        { thumbnail_url },
        { new: true, select: "-__v" }
    );

    res.status(200).json(
        new APIresponse(200, "Thumbnail updated successfully", video)
    );
});

const changeVisibility = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const { is_public } = req.body;
    const userId = req.user._id;

    if (typeof is_public !== "boolean") {
        throw new APIerror(400, "is_public must be a boolean value");
    }

    await validateVideoOwnership(video_id, userId);

    const video = await Video.findByIdAndUpdate(
        video_id,
        { is_public },
        { new: true, select: "-__v" }
    );

    const status = is_public ? "public" : "private";
    res.status(200).json(
        new APIresponse(200, `Video visibility changed to ${status}`, video)
    );
});

const viewVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    validateObjectId(video_id, "video ID");

    const video = await Video.findById(video_id)
        .populate("channel_id", "name banner_url")
        .select("-__v");

    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    if (!video.is_public) {
        throw new APIerror(403, "This video is private");
    }

    video.views += 1;
    await video.save();

    res.status(200).json(
        new APIresponse(200, "Video viewed successfully", video)
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const query = { is_public: true };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const videos = await Video.find(query)
        .populate("channel_id", "name banner_url")
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .select("-__v");

    res.status(200).json(
        new APIresponse(200, "Videos retrieved successfully", {
            videos,
            count: videos.length
        })
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channel_id } = req.params;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    validateObjectId(channel_id, "channel ID");

    const channel = await Channel.findById(channel_id).select("owner");

    if (!channel) {
        throw new APIerror(404, "Channel not found");
    }

    const isOwner = req.user && channel.owner.toString() === req.user._id.toString();
    const query = { channel_id };
    if (!isOwner) {
        query.is_public = true;
    }

    const videos = await Video.find(query)
        .populate("channel_id", "name banner_url")
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .select("-__v");

    res.status(200).json(
        new APIresponse(200, "Channel videos retrieved successfully", {
            videos,
            count: videos.length
        })
    );
});

export {
    postVideo,
    getVideo,
    deleteVideo,
    updateThumbnail,
    changeVisibility,
    viewVideo,
    getAllVideos,
    getChannelVideos
};