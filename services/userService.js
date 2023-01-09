const User = require("../models/User");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const { uploadCloudinary } = require("../utils/cloudinary");
const Company = require("../models/Company");

exports.findUserById = async id => {
  const user = await User.findById(id);
  if (!user) {
    throw new ErrorResponse(`User not found with id of ${id}`, 404);
  }
  const companies = await Company.where('followers').in([user.id])
  return {user, following: companies};
};

exports.findUserByEmail = async email => {
  const user = await User.findOne({ email: email }).select("+password");
  return user;
};

exports.findAll = async params => {
  return await User.find(params);
};

exports.updateProfile = async (data, id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ErrorResponse("There is no user", 404);
  }

  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.updatePhoto = async req => {
  const file = req.files.file;
  
  const image = await uploadCloudinary(file);

  return await User.findByIdAndUpdate(
    req.user.id,
    {
      avatar: image.url || '',
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
