//   id string pk
//   username string
//   email string
//   password string
//   created_at timestamp
//   updated_at timestamp
//   playlist array of ObjectId references to Playlist
//   profile_picture_url string
//   bio string
//   refreshToke string 
import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    profile_picture_url: {
        type: String,
    },
    bio: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    playlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    }], 
},{
    timestamps: true
})
const User = mongoose.model("User", UserSchema);
export default User;