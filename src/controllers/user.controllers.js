import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";

const userController = asyncHandler(async (req, res) => {
    const { username, email, password, bio } = req.body;
    
    if (!username || !email || !password) {
        throw new APIerror(400, "Username, email, and password are required");
    }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new APIerror(400, "User already exists with this username or email");
    }

    const profile_picture = req.body?.cloudinaryUploads?.profile_picture?.[0]?.secure_url || undefined;

    const user = await User.create({
        username,
        email,
        password,
        bio,
        profile_picture_url: profile_picture,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new APIerror(500, "User creation failed");
    }

    res.status(201).json(
        new APIresponse(201, "User created successfully", createdUser)
    );
});
const generateTokens = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Internal server error while generating tokens");
    }
};
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!username && !email) {
        throw new APIerror(400, "Either email or username is required");
    }

    const user = await User.findOne({$or: [{ email }, { username }]})

    if (!user || !(await user.comparePassword(password))) {
        throw new APIerror(401, "Invalid credentials");
    }

    const tokens = await generateTokens(user._id);
    res.status(200)
    .cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    .json(
        new APIresponse(200, "Login successful"
    ))
});
const loggedInUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new APIerror(404, "User not found");
    }
    res.status(200).json(
        new APIresponse(200, "User retrieved successfully", user)
    );
});
const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new APIerror(401, "User not authenticated");
    }
    await User.findByIdAndUpdate(req.user._id, 
        { refreshToken: null }, 
        { new: true })
        .then(() => {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json(
                new APIresponse(200, "Logout successful")
            );
        })
        .catch((error) => {
            throw new APIerror(500, "Internal server error during logout", error);
        });
})
const updateUsername = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        throw new APIerror(400, "Username is required");
    }

    const existingUser = await User.findOne(
        { username, _id: { $ne: req.user._id } }
    )
    if (existingUser) {
        throw new APIerror(400, "Username already exists");
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { username },
        { new: true, select: "-password -refreshToken" }
    );
    if (!user) {
        throw new APIerror(404, "User not found for username update");
    }
    res.status(200).json(
        new APIresponse(200, "Username updated successfully", user)
    )
})
const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new APIerror(400, "Current and new passwords are required");
    }

    const user = await User.findById(req.user._id);

    if (!user || !(await user.comparePassword(currentPassword))) {
        throw new APIerror(401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(
        new APIresponse(200, "Password updated successfully")
    );
})
const updateProfile_picture = asyncHandler(async (req, res) => {
    const new_profile_picture = req.body?.cloudinaryUploads?.profile_picture?.[0]?.secure_url;

    if (!new_profile_picture) {
        return res.status(400).json({ message: "Profile picture is required", success: false });
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { profile_picture_url: new_profile_picture },
        { new: true, select: "-password -refreshToken" }
    );
    if (!user) {
        throw new APIerror(404, "User not found for profile picture update");
    }
    res.status(200).json(
        new APIresponse(200, "Profile picture updated successfully", user)
    );
})
const updateBio = asyncHandler(async (req, res) => {
    const { bio } = req.body;

    if (!bio) {
        throw new APIerror(400, "Bio is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { bio },
        { new: true, select: "-password -refreshToken" }
    );

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    res.status(200).json(
        new APIresponse(200, "Bio updated successfully", user)
    );
})
export { userController, loginUser, generateTokens , loggedInUser , logoutUser , updateUsername, updatePassword, updateProfile_picture, updateBio };