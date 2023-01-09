const Company = require('../models/Company');
const vacancyService = require('./vacancyService');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const { uploadCloudinary } = require('../utils/cloudinary');

exports.findCompanyByUrl = async companyUrl => {
  const company = await Company.findOne({ companyUrl });
  if (!company) {
    throw new ErrorResponse(`Company not found`, 400);
  }
  const vacancies = await vacancyService.getVacancies(companyUrl);
  return { company, vacancies };
};

exports.getCompanies = async () => {
  return await Company.find();
};

exports.isFollow = async (user, companyUrl) => {
  const isFollow = await Company.exists({
    companyUrl: {
      $eq: companyUrl,
    },
    followers: {
      $all: [mongoose.Types.ObjectId(user.id)],
    },
  });
  return isFollow;
};

exports.followOrUnfollow = async (user, companyUrl) => {
  const isFollow = await this.isFollow(user, companyUrl);
  if (!isFollow) {

    return await Company.findOneAndUpdate(
      { companyUrl },
      {
        $push: { followers: user.id },
        $inc: { followersCount: 1 } 
      }
    );
  } else {
    return await Company.findOneAndUpdate(
      { companyUrl },
      {
        $pull: { followers: user.id },
        $inc: {followersCount: -1}
      }
    );
  }
};

exports.addCompany = async req => {
  const {
    name,
    companyUrl,
    address,
    website,
    description,
    background,
    year,
    staff,
    about,
  } = req.body;
  let image = '';
  if (req.files && req.files.avatar) {
    const { avatar } = req.files;
    if (avatar) {
      image = await uploadCloudinary(avatar);
    }
  }
  return await Company.create({
    name,
    companyUrl,
    address,
    website,
    description,
    background,
    year,
    staff,
    avatar: image.url || null,
    about,
    author: req.user.id,
  });
};
