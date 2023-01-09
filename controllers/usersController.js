const userService = require("../services/userService");
const asyncHandler = require("../middleware/async");

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await userService.findUserById(req.params.userId)
  res.status(201).json({
    success: true,
    user: user
  });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await userService.updateProfile(req.body, req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updatePhoto = asyncHandler(async (req, res, next) => {
  const user = await userService.updatePhoto(req)
  res.status(200).json({
    success: true,
    data: user,
  });
});



