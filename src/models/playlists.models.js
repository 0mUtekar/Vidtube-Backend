//   id string pk
//   user_id string
//   name string
//   description string
//   created_at timestamp
//   is_public boolean
import mongoose, {Schema} from "mongoose";
const PlaylistSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    is_public: {
        type: Boolean,
        default: true // true for public, false for private
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }]},
    {
        timestamps: true
    }
)
const Playlist = mongoose.model("Playlist", PlaylistSchema);
export { Playlist };