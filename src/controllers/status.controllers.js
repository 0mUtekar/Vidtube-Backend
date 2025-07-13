import {asyncHandler} from '../utils/asyncHandler.js';
import {APIresponse} from '../utils/APIresponse.js';
const statusChecker = asyncHandler(async (req, res) => {
  res.status(200).json(
        new APIresponse (200, "Server is running smoothly")
    );
})
export {statusChecker};