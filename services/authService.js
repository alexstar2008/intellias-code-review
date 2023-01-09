const User = require("../models/User");
const userService = require("../services/userService");
const ErrorResponse = require("../utils/errorResponse");

exports.registerUser = async user => {
  const findUser = await userService.findUserByEmail(user.email);
  if (findUser) {
    throw new ErrorResponse("User is already exists", 409);
  }
  return await User.create(user);
};

exports.loginUser = async ({ email, password }) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new ErrorResponse("Email or password are incorrect", 409);
  }
  const isEqual = await user.comparePassword(password);
  if (!isEqual) {
    throw new ErrorResponse("Email or password are incorrect", 409);
  }
  return { token: user.generateToken(), userId: user._id };
};
