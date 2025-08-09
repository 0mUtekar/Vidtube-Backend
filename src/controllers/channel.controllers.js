import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { Channel } from "../models/channel.models.js";

const channelOwnership = (channel, userID) => {
    if (!channel || !userID) {
        throw new APIerror(400, "Channel or owner ID is required");
    }
    if (channel.owner.toString() !== userID.toString()) {
        throw new APIerror(403, "You are not the owner of this channel");
    }
};

const createChannel = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user?._id;

    if (!owner) throw new APIerror(400, "Owner ID is required");
    if (!name) throw new APIerror(400, "Channel name is required");

    if (await Channel.findOne({ name })) {
        throw new APIerror(400, "Channel with this name already exists");
    }
    if (await Channel.findOne({ owner })) {
        throw new APIerror(400, "You already have a channel");
    }

    const banner_url = req.body?.cloudinaryUploads?.banner?.[0]?.secure_url || undefined;

    const channel = await Channel.create({
        owner,
        name,
        description,
        banner_url,
    });

    return res
        .status(201)
        .json(new APIresponse(201, "Channel created successfully", channel));
});

const getChannel = asyncHandler(async (req, res) => {
    const { channelName } = req.params;

    if (!channelName) throw new APIerror(400, "Channel name is required");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    return res.status(200).json(new APIresponse(200, "Channel retrieved successfully", channel));
});

const subscribeTo = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    const userId = req.user?._id;

    if (!channelName) throw new APIerror(400, "Channel name is required");
    if (!userId) throw new APIerror(400, "User ID is required");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    if (channel.subscribers.some(sub => sub.toString() === userId.toString())) {
        throw new APIerror(400, "You are already subscribed to this channel");
    }

    channel.subscribers.push(userId);
    channel.subscribers_count = channel.subscribers.length;

    await channel.save();
    return res.status(200).json(new APIresponse(200, "Subscribed to channel successfully", channel));
});

const unsubscribeFrom = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    const userId = req.user?._id;

    if (!channelName) throw new APIerror(400, "Channel name is required");
    if (!userId) throw new APIerror(400, "User ID is required");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    if (!channel.subscribers.some(sub => sub.toString() === userId.toString())) {
        throw new APIerror(400, "You are not subscribed to this channel");
    }

    channel.subscribers = channel.subscribers.filter(
        sub => sub.toString() !== userId.toString()
    );
    channel.subscribers_count = channel.subscribers.length;

    await channel.save();
    return res.status(200).json(new APIresponse(200, "Unsubscribed from channel successfully", channel));
});

const updateBanner = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    const userID = req.user?._id;

    if (!channelName) throw new APIerror(400, "Channel Name is required");
    if (!userID) throw new APIerror(400, "User ID is required");

    const banner_url = req.body?.cloudinaryUploads?.banner?.[0]?.secure_url;
    if (!banner_url) throw new APIerror(400, "Banner upload failed");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    channelOwnership(channel, userID);
    channel.banner_url = banner_url;
    await channel.save();

    res.status(200).json(new APIresponse(200, "Banner updated successfully", channel));
});

const updateChannelName = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    const userId = req.user?._id;
    const { newName } = req.body;

    if (!userId) throw new APIerror(400, "User ID is required");
    if (!channelName || !newName) throw new APIerror(400, "Channel name and new name are required");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    channelOwnership(channel, userId);

    if (await Channel.findOne({ name: newName })) {
        throw new APIerror(400, "Channel with this name already exists");
    }

    channel.name = newName;
    await channel.save();

    return res.status(200).json(new APIresponse(200, "Channel name updated successfully", channel));
});

const getSubscribers = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    if (!channelName) throw new APIerror(400, "Channel name is required");

    const channel = await Channel.findOne({ name: channelName }).populate('subscribers', 'username');
    if (!channel) throw new APIerror(404, "Channel not found");

    if (!channel.subscribers || channel.subscribers.length === 0) {
        return res.status(200).json(new APIresponse(200, "No subscribers found for this channel", []));
    }

    return res.status(200).json(new APIresponse(200, "Subscribers retrieved successfully", channel.subscribers));
});

const getSubscribersCount = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    if (!channelName) throw new APIerror(400, "Channel name is required");

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) throw new APIerror(404, "Channel not found");

    return res.status(200).json(
        new APIresponse(200, "Subscribers count retrieved successfully", { subscribersCount: channel.subscribers_count })
    );
});

export {
    createChannel,
    getChannel,
    subscribeTo,
    unsubscribeFrom,
    updateBanner,
    getSubscribers,
    getSubscribersCount,
    updateChannelName
};
