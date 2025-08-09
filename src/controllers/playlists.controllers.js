import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Playlist } from "../models/playlists.models.js";

const playlistOwnership = (playlist, user) => {
    if (!playlist || !user) {
        throw new APIerror(400, "Playlist or owner ID is required");
    }
    const ownerId = playlist.owner._id || playlist.owner;
    if (ownerId.toString() !== user.toString()) {
        throw new APIerror(403, "You are not the owner of this playlist");
    }
};

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, is_public } = req.body;
    const owner = req.user?._id;

    if (!owner) throw new APIerror(400, "Owner ID is required");
    if (!name) throw new APIerror(400, "Playlist name is required");

    const existingPlaylist = await Playlist.findOne({ owner, name });
    if (existingPlaylist) throw new APIerror(400, "Playlist with this name already exists");

    const playlist = await Playlist.create({ owner, name, description, is_public });
    if (!playlist) throw new APIerror(500, "Failed to create playlist");

    res.status(201).json(new APIresponse(201, "Playlist created successfully", playlist));
});

const getPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params;
    if (!playlist_id) throw new APIerror(400, "Playlist ID is required");

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new APIerror(404, "Playlist not found");

    res.status(200).json(new APIresponse(200, "Playlist retrieved successfully", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { video_id } = req.body;
    const { playlist_id } = req.params;
    const user = req.user?._id;

    if (!video_id) throw new APIerror(400, "Video ID is required");
    if (!playlist_id) throw new APIerror(400, "Playlist ID is required");
    if (!user) throw new APIerror(400, "User ID is required");

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new APIerror(404, "Playlist not found");

    playlistOwnership(playlist, user);

    if (playlist.videos.includes(video_id)) {
        throw new APIerror(400, "Video already exists in this playlist");
    }

    playlist.videos.push(video_id);
    await playlist.save();

    res.status(200).json(new APIresponse(200, "Video added to playlist successfully", playlist));
});

const viewPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params;
    if (!playlist_id) throw new APIerror(400, "Playlist ID is required");

    const playlist = await Playlist.findById(playlist_id).populate("videos");
    if (!playlist) throw new APIerror(404, "Playlist not found");

    if (!playlist.is_public && playlist.owner.toString() !== req.user?._id.toString()) {
        throw new APIerror(403, "This playlist is private");
    }

    res.status(200).json(new APIresponse(200, "Playlist retrieved successfully", playlist));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params;
    const user = req.user?._id;

    if (!playlist_id) throw new APIerror(400, "Playlist ID is required");
    if (!user) throw new APIerror(400, "User ID is required");

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new APIerror(404, "Playlist not found");

    playlistOwnership(playlist, user);

    await playlist.deleteOne();

    res.status(200).json(new APIresponse(200, "Playlist deleted successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { video_id, playlist_id } = req.params;
    const user = req.user?._id;

    if (!video_id) throw new APIerror(400, "Video ID is required");
    if (!playlist_id) throw new APIerror(400, "Playlist ID is required");
    if (!user) throw new APIerror(400, "User ID is required");

    const playlist = await Playlist.findById(playlist_id);
    if (!playlist) throw new APIerror(404, "Playlist not found");

    playlistOwnership(playlist, user);

    if (!playlist.videos.includes(video_id)) {
        throw new APIerror(404, "Video not found in this playlist");
    }

    playlist.videos.pull(video_id);
    await playlist.save();

    res.status(200).json(new APIresponse(200, "Video removed from playlist successfully", playlist));
});

export {
    createPlaylist,
    addVideoToPlaylist,
    viewPlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    getPlaylist
};