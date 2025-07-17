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
import bcypt from "bcrypt";

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
    }]},
    {
        timestamps: true
    }
)
// Pre-save hook to hash the password before saving the user
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcypt.genSalt(10);
        this.password = await bcypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcypt.compare(candidatePassword, this.password);
};
UserSchema.methods.generateAccessToken = function() {
    // Generate an access token for the user
    return jwt.sign({ 
            _id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_JWT_SECRET, 
        { expiresIn: process.env.ACCESS_JWT_EXPIRATION });

}
UserSchema.methods.generateRefreshToken = function() {
    // Generate a refresh token for the user
    return jwt.sign({ 
            _id: this._id,
        },
        process.env.REFRESH_JWT_SECRET, 
        { expiresIn: process.env.REFRESH_JWT_EXPIRATION });
} 
const User = mongoose.model("User", UserSchema);
export {User};