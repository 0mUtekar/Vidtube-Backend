//   id string pk
//   video_id string
//   user_id string
//   content string
//   created_at timestamp
import mongoose, {Schema} from "mongoose";

const CommentsSchema = new Schema({
    video_id: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: [1, "Comment cannot be empty"]
    }},
     {
        timestamps: true
    }
)
const Comment = mongoose.model("Comments", CommentsSchema);
export default Comment;