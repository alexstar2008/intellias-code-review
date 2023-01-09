const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a company name"],
      trim: true,
      maxLength: 10
    },
    companyUrl: {
      type: String,
      required: [true, "Please add a company URL"],
      lowercase: true,
      trim: true,
      maxlength: 10,
      minlength: 3,
      unique: [true, "This URL exists"],
    },
    address: {
      type: String,
      required: [true, "Please add an office address"],
    },
    website: {
      type: String,
      required: [true, "Please add a website"],
    },
    description: {
      type: String,
      nullable: true,
      maxlength: [35, "Please add a short description"],
    },
    background: {
      type: String,
      nullable: true
    },
    year: {
      type: String,
      nullable: true,
    },
    staff: {
      type: Number,
      nullable: true,
      min: 10,
      max: 10000,
    },
    avatar: {
      type: String,
      nullable: true,
    },
    about: {
      type: String,
      minlength: [70, "Please tell more about your company"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", CompanySchema);
