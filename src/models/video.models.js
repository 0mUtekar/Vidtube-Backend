//   id string pk
//   channel_id string
//   title string
//   description string
//   video_url string
//   thumbnail_url string
//   is_public string
//   views int
//   upload_date timestamp
import mongoose, {Schema} from "mongoose";

const VideoSchema = new Schema({
    channel_id :{
        type: Schema.Types.ObjectId,
        ref: 'Channel',
    },
    title : {
        type: String,
        required: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
        trim: true,
    },
    description : {
        type: String,
        default: "",
        maxlength: 500,
    },
    video_url : {
        type: String,
        required: true,
    },
    thumbnail_url : {
        type: String,
    },
    is_public : {
        type: Boolean,
        default: true, // true for public, false for private
    },
    views : {
        type: Number,
        default: 0,
    }},
    {
        timestamps: true
    }
)
const Video = mongoose.model("Video", VideoSchema);
export { Video };