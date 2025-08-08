import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { Channel } from "../models/channel.models.js";

const createChannel = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user?._id;

    if (!owner) {
        throw new APIerror("Owner ID is required", 400);
    }
    if (!name) {
        throw new APIerror("Channel name is required", 400);
    }

    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
        throw new APIerror("Channel with this name already exists", 400);
    }
    const channelsofowner = await Channel.findOne({ owner : owner });
    if (channelsofowner) {
        throw new APIerror("You already have a channel", 400);
    }

    const banner_url = req.body?.cloudinaryUploads?.banner?.[0]?.secure_url || undefined;

    const channel = await Channel.create({
        owner,
        name,
        description,
        banner_url,
    });

    if (!channel) {
        throw new APIerror("Failed to create channel", 500);
    }

    return res
        .status(201)
        .json(new APIresponse(201, "Channel created successfully", channel));
});

const getChannel = asyncHandler(async (req, res, next) => {
    const { channelName } = req.params.channelName;

    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }

    const channel = await Channel.findOne({ name: channelName })

    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    return res.status(200).json(new APIresponse("Channel retrieved successfully", channel));
})
const subsribeTo = asyncHandler(async (req, res) => {
    const { channelName } = req.params.channelName;
    const userId = req.user?._id;
    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }
    if (!userId) {
        throw new APIerror("User ID is required", 400);
    }
    const channel = await Channel.find({ name: channelName });
    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    if (channel.subscribers.includes(userId)) {
        throw new APIerror("You are already subscribed to this channel", 400);
    }
    channel.subscribers.push(userId);
    channel.subscribers_count += 1;
    await channel.save();
    return res.status(200).json(new APIresponse("Subscribed to channel successfully", channel));
});
const unsubscribeFrom = asyncHandler(async (req, res) => {
    const channelName = req.params.channelName;
    const userId = req.user?._id;
    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }
    if (!userId) {
        throw new APIerror("User ID is required", 400);
    }
    const channel = await Channel.find({ name: channelName });
    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    if (!channel.subscribers.includes(userId)) {
        throw new APIerror("You are not subscribed to this channel", 400);
    }
    channel.subscribers = channel.subscribers.filter(subscriber => subscriber.toString() !== userId.toString());
    channel.subscribers_count -= 1;
    await channel.save();
    return res.status(200).json(new APIresponse("Unsubscribed from channel successfully", channel));
})

const updateBanner  = asyncHandler(async (req, res) => {
    const { channelName } = req.params.channelName;
    if (!channelName) {
        throw new APIerror(400, "Channel Name is required");
    }
    const banner_url = req.body?.cloudinaryUploads?.banner?.[0]?.secure_url;
    if (!banner_url) {
        throw new APIerror(400, "Banner upload failed");
    }
    const channel = await Channel.findOneAndUpdate({ name: channelName }, { banner_url }, { new: true });
    if (!channel) {
        throw new APIerror(404, "Channel not found");
    }
    res.status(200).json(new APIresponse(channel, "Banner updated successfully"));
})
const updateChannelName = asyncHandler(async (req, res) => {
    const { channelName } = req.params.channelName;
    const userId = req.user?._id;
    const { newName } = req.body;
    if (!userId) {
        throw new APIerror("User ID is required", 400);
    }
    if (!channelName || !newName) {
        throw new APIerror("Channel name and new name are required", 400);
    }
    const channel = await Channel.findOneAndUpdate({ name: channelName }, { name: newName }, { new: true });
    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    return res.status(200).json(new APIresponse("Channel name updated successfully", channel));
})
const getSubscribers = asyncHandler(async (req, res) => {
    const { channelName } = req.params.channelName;
    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }
    const channel = await Channel.findOne({ name: channelName }).populate('subscribers', 'username');
    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    const subscribers = channel.subscribers;
    if( !subscribers || subscribers.length === 0) {
        return res.status(404).json(new APIresponse("No subscribers found for this channel", []));
    }
    return res.status(200).json(new APIresponse("Subscribers retrieved successfully", subscribers));
})

const getSubscribersCount = asyncHandler(async (req, res) => {
    const { channelName } = req.params.channelName;
    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }
    const channel = await Channel.findOne({ name: channelName });
    if (!channel) { 
        throw new APIerror("Channel not found", 404);
    }
    const subscribersCount = channel.subscribers_count;
    return res.status(200).json(new APIresponse("Subscribers count retrieved successfully", { subscribersCount }));
})
export { createChannel, getChannel , subsribeTo , unsubscribeFrom, updateBanner , getSubscribers, getSubscribersCount, updateChannelName };