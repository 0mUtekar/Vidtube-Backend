import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { Comment } from "../models/comments.models.js";

const commentOwnership = (comment, userID) => {
    if (!comment || !userID) {
        throw new APIerror(400, "Comment or user ID is required");
    }
    const commentOwnerId = comment.owner._id || comment.owner;
    if (commentOwnerId.toString() !== userID.toString()) {
        throw new APIerror(403, "You are not the owner of this comment");
    }
};

const postComment = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    const user = req.user;

    if (!video_id || !user) {
        throw new APIerror(400, "Video ID and User ID are required");
    }

    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new APIerror(400, "Comment content cannot be empty");
    }

    const comment = await Comment.create({
        video_id,
        owner: user._id,
        content
    });

    res.status(201).json(
        new APIresponse(201, "Comment posted successfully", comment)
    );
});

const getComments = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }

    const comments = await Comment.find({ video_id })
        .populate('owner', 'username');

    if (!comments || comments.length === 0) {
        return res.status(404).json(
            new APIresponse(404, "No comments found for this video")
        );
    }

    res.status(200).json(
        new APIresponse(200, "Comments retrieved successfully", comments)
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    const user = req.user;

    if (!comment_id) {
        throw new APIerror(400, "Comment ID is required");
    }

    const comment = await Comment.findById(comment_id);
    if (!comment) {
        throw new APIerror(404, "Comment not found");
    }

    commentOwnership(comment, user._id);

    await Comment.deleteOne({ _id: comment_id });

    res.status(200).json(
        new APIresponse(200, "Comment deleted successfully")
    );
});

const getCommentsCount = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    if (!video_id) {
        throw new APIerror(400, "Video ID is required");
    }

    const count = await Comment.countDocuments({ video_id });

    res.status(200).json(
        new APIresponse(200, "Comments count retrieved successfully", { count })
    );
});

export { postComment,
        getComments,
        deleteComment,
        getCommentsCount };
