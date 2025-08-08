import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Playlist } from "../models/playlists.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, is_public } = req.body;
    const owner = req.user?._id;

    if (!owner) {
        throw new APIerror("Owner ID is required", 400);
    }
    if (!name) {
        throw new APIerror("Playlist name is required", 400);
    }

    const existingPlaylist = await Playlist.findOne( 
        {$and: [{ owner }, { name } ]}
    );
    if (existingPlaylist) {
        throw new APIerror("Playlist with this name already exists", 400);
    }

    const playlist = await Playlist.create({
        owner,
        name,
        description,
        is_public
    });

    if (!playlist) {
        throw new APIerror("Failed to create playlist", 500);
    }

    return res
        .status(201)
        .json(new APIresponse(201, "Playlist created successfully", playlist));
})

const getPlaylist = asyncHandler(async (req, res) => {
    const playlist_ID = req.params.playlist_id;
    if (!playlist_ID) {
        throw new APIerror("Playlist ID is required", 400);
    }
    const playlists = await Playlist.find({ owner: playlist_ID });
    if (!playlists || playlists.length === 0) {
        throw new APIerror("No playlists found", 404);
    }
    return res
        .status(200)
        .json(new APIresponse(200, "Playlists retrieved successfully", playlists));
})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { video_ID } = req.body;
    const playlist_ID = req.params.playlist_id;
    const owner = req.user?._id;

    if (!video_ID) {
        throw new APIerror("Video ID is required", 400);
    }
    if (!playlist_ID) {
        throw new APIerror("Playlist ID is required", 400);
    }
    if (!owner) {
        throw new APIerror("Owner ID is required or you are not the owner", 400);
    }
    const playlist = await Playlist.findOne({ _id: playlist_ID, owner });
    if (!playlist) {
        throw new APIerror("Playlist not found!", 404);
    }
    if (playlist.videos.includes(video_ID)) {
        throw new APIerror("Video already exists in this playlist", 400);
    }
    playlist.videos.push(video_ID);
    await playlist.save();
    return res
        .status(200)
        .json(new APIresponse(200, "Video added to playlist successfully", playlist));
})

const viewPlaylist = asyncHandler(async (req, res) => {
    const playlist_ID = req.params.playlist_id;
    if (!playlist_ID) {
        throw new APIerror("Playlist ID is required", 400);
    }
    const playlist = await Playlist.findById(playlist_ID).populate('videos');
    if (!playlist) {
        throw new APIerror("Playlist not found", 404);
    }
    if (!playlist.is_public && playlist.owner.toString() !== req.user?._id.toString()) {
        throw new APIerror("This playlist is private", 403);
    }
    return res
        .status(200)
        .json(new APIresponse(200, "Playlist retrieved successfully", playlist));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const playlist_ID = req.params.playlist_id;
    const owner = req.user?._id;

    if (!playlist_ID) {
        throw new APIerror("Playlist ID is required", 400);
    }
    if (!owner) {
        throw new APIerror("Owner ID is required or you are not the owner", 400);
    }
    const playlist = await Playlist.findOneAndDelete({ _id: playlist_ID, owner });
    if (!playlist) {
        throw new APIerror("Playlist not found or you are not the owner", 404);
    }
    return res
        .status(200)
        .json(new APIresponse(200, "Playlist deleted successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { video_ID } = req.params.video_id;
    const playlist_ID = req.params.playlist_id;
    const owner = req.user?._id;

    if (!video_ID) {
        throw new APIerror("Video ID is required", 400);
    }
    if (!playlist_ID) {
        throw new APIerror("Playlist ID is required", 400);
    }
    if (!owner) {
        throw new APIerror("Owner ID is required or you are not the owner", 400);
    }
    const playlist = await Playlist.findOne({ _id: playlist_ID, owner });
    if (!playlist) {
        throw new APIerror("Playlist not found!", 404);
    }
    if (!playlist.videos.includes(video_ID)) {
        throw new APIerror("Video does not exist in this playlist", 400);
    }
    playlist.videos.pull(video_ID);
    await playlist.save();
    return res
        .status(200)
        .json(new APIresponse(200, "Video removed from playlist successfully", playlist));
})

export { createPlaylist, addVideoToPlaylist, viewPlaylist, deletePlaylist, removeVideoFromPlaylist , getPlaylist};