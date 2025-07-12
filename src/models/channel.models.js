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
    },  
    banner_url : {
        type: String,
    }},
    {
    timestamps: true   
    }
)
const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;