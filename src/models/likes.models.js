//   id string pk
//   user_id string
//   video_id string
//   created_at timestamp
import mongoose, {Schema} from "mongoose";
const LikeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video_id: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    }},
    {
        timestamps: true
    }
)
const Like = mongoose.model("Like", LikeSchema);
export default Like;