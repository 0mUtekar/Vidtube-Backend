import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";

const userController = asyncHandler(async (req, res) => {
    const { username, email, password, bio } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new APIerror(400, "User already exists with this username or email");
    }

    const profile_picture = req.files?.profile_picture?.[0]?.path;
    if (!profile_picture) {
        throw new APIerror(400, "Profile picture is required");
    }

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

export { userController };