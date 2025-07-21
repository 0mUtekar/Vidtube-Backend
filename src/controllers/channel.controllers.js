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

    const banner_url = req.body?.cloudinaryUploads?.banner_url?.[0]?.secure_url || undefined;

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
    const { channelName } = req.params;

    if (!channelName) {
        throw new APIerror("Channel name is required", 400);
    }

    const channel = await Channel.findOne({ name: channelName })

    if (!channel) {
        throw new APIerror("Channel not found", 404);
    }
    return res.status(200).json(new APIresponse("Channel retrieved successfully", channel));
})

export { createChannel, getChannel };