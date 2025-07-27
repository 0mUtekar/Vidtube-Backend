import { asyncHandler } from "../utils/asyncHandler.js";
import { APIresponse } from "../utils/APIresponse.js";
import { APIerror } from "../utils/APIerror.js";
import { Comment } from "../models/comments.models.js";

const postComment = asyncHandler(async (req, res) => {
    const video_id = req.params.video_id;
    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new APIerror("Comment content cannot be empty", 400);
    }
    const user = req.user;
    const comment = await Comment.create({
        video_id,
        user_id: user._id,
        content
    });
    res.status(201).json(new APIresponse("Comment posted successfully", comment));
})

const getComments = asyncHandler(async (req, res) => {
    const video_id = req.params.video_id;
    if (!video_id) {
        throw new APIerror("Video ID is required", 400);
    }
    const comments = await Comment.find({ video_id }).populate('user_id', 'username');
    if (!comments || comments.length === 0) {
        return res.status(404).json(new APIresponse("No comments found for this video"));
    }
    res.status(200).json(new APIresponse("Comments retrieved successfully", comments));
})

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.comment_id;
    const user = req.user;

    if (!commentId) {
        throw new APIerror("Comment ID is required", 400);
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new APIerror("Comment not found", 404);
    }

    if (comment.user_id.toString() !== user._id.toString()) {
        throw new APIerror("You can only delete your own comments", 403);
    }

    await Comment.deleteOne({ _id: commentId });
    res.status(200).json(new APIresponse("Comment deleted successfully"));
})
 const getCommentsCount = asyncHandler(async (req, res) => {
    const video_id = req.params.video_id;
    if (!video_id) {
        throw new APIerror("Video ID is required", 400);
    }
    const count = await Comment.countDocuments({ video_id });
    res.status(200).json(new APIresponse("Comments count retrieved successfully", { count }));
})

export { postComment, getComments, deleteComment, getCommentsCount };