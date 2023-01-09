const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const userService = require("../services/userService");

/**
 * Widdleware which check jwt token in request.
 */
module.exports = asyncHandler(async (req, res, next) => {
  let decodedToken;
  if (req.cookies.accessToken) {
    try {
      decodedToken = jwt.verify(req.cookies.accessToken, process.env.SECRETKEY);
    } catch (err) {
      throw new ErrorResponse(err.message, 401);
    }
    if (!decodedToken) {
      throw new ErrorResponse("Not authenticated", 401);
    }
    const { user } = await userService.findUserById(decodedToken.userId);
    req.user = user;
    req.body.user = decodedToken.userId;
  } else {
    throw new ErrorResponse("Not authenticated", 401);
  }
  next();
});
