import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror";
import { APIresponse } from "../utils/APIresponse";
import { Video } from "../models/video.model.js";

const postVideo = asyncHandler(async (req, res) => {
    const { channel_id, title, description, is_public } = req.body;
    if (!channel_id || !title ) {
        throw new APIerror(400, "Channel ID and title are required");
    }

    const video_url = req.body?.cloudinaryUploads?.video?.secure_url;
    const thumbnail_url = req.body?.cloudinaryUploads?.thumbnail?.[0]?.secure_url;
    
    if (!video_url) {
        throw new APIerror(400, "Video upload failed");
    }
    if (!thumbnail_url) {
        throw new APIerror(400, "Thumbnail upload failed");
    }
    const video = await Video.create({
        channel_id,
        title,
        description,
        video_url,
        thumbnail_url,
        is_public
    });
    res.status(201).json(new APIresponse(video, "Video uploaded successfully"));
})

const getVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    const video = await Video.findById(video_id).select('-is_public -video_url');
    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    res.status(200).json(new APIresponse(video, "Video retrieved successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    const video = await Video.findByIdAndDelete(video_id);
    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    res.status(200).json(new APIresponse(null, "Video deleted successfully"));
})

const updateThumbnail = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    const thumbnail_url = req.body?.cloudinaryUploads?.thumbnail?.[0]?.secure_url;
    if (!thumbnail_url) {
        throw new APIerror(400, "Thumbnail upload failed");
    }
    const video = await Video.findByIdAndUpdate(video_id, { thumbnail_url }, { new: true });
    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    res.status(200).json(new APIresponse(video, "Thumbnail updated successfully"));
})
const veiwVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    const video = await Video.findById(video_id).select('-is_public');
    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    if (!video.is_public) {
        throw new APIerror(403, "This video is private");
    }
    video.views += 1;
    await video.save();
    res.status(200).json(new APIresponse(video, "Video viewed successfully"));
})
const changeVisibility = asyncHandler(async (req, res) => {
    const { video_id } = req.params.video_id;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }
    const { is_public } = req.body;
    if (typeof is_public !== 'boolean') {
        throw new APIerror(400, "is_public must be a boolean");
    }
    const video = await Video.findByIdAndUpdate(video_id, { is_public }, { new: true });
    if (!video) {
        throw new APIerror(404, "Video not found");
    }
    res.status(200).json(new APIresponse(video, "Video visibility updated successfully"));
})

export { postVideo, getVideo, deleteVideo, updateThumbnail, changeVisibility, veiwVideo };