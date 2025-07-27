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
import jwt from "jsonwebtoken";
import { promisify } from "util";
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
        default: "https://res.cloudinary.com/dhcz9eecl/image/upload/v1753129465/Screenshot_2025-07-22_015340_q4gdnf.png"
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
const jwtSignAsync = promisify(jwt.sign);
UserSchema.methods.generateAccessToken = async function () {
    try {
        let payload = { _id: this._id };

        if (this.username) payload.username = this.username;
        if (this.email) payload.email = this.email;

        return await jwtSignAsync(
            payload,
            process.env.ACCESS_JWT_SECRET,
            { expiresIn: process.env.ACCESS_JWT_EXPIRATION }
        );
    } catch (err) {
        console.error("Error in generateAccessToken:", err);
        throw err;
    }
};

UserSchema.methods.generateRefreshToken = async function () {
    try {
        return await jwtSignAsync(
            { _id: this._id },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: process.env.REFRESH_JWT_EXPIRATION }
        );
    } catch (err) {
        console.error("Error in generateRefreshToken:", err);
        throw err;
    }
};

const User = mongoose.model("User", UserSchema);
export {User};