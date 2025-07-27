//   id string pk
//   owner string
//   name string
//   description string
//   created_at timestamp
//   updated_at timestamp
//   banner_url string
import mongoose, {Schema} from "mongoose";

const ChannelSchema = new Schema({
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name : {
        type: String,
        required: true,
        unique: true
    },
    description : {
        type: String,
        default: "Welcome to my channel!"
    },  
    banner_url : {
        type: String,
        default: "https://res.cloudinary.com/dhcz9eecl/image/upload/v1753128780/default_banner_o49iu4.jpg"
    },
    subsribers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],
    subsribers_count: {
        type: Number,
        default: 0
    }},
    {
        timestamps: true   
    }
)
const Channel = mongoose.model("Channel", ChannelSchema);
export { Channel };