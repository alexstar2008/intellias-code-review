const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { emailValidRegex, maxYear, roles, status, positions } = require('../utils/modelTypes');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [emailValidRegex, 'Please add a valid email'],
    },
    birthDate: {
      type: Date,
      nullable: true,
      min: ['1940-01-01', 'You are too old for us :)'],
      max: [maxYear, 'You are too younger for us :)'],
    },
    role: {
      type: String,
      enum: roles,
      default: 'Applicant',
    },
    status: {
      type: String,
      enum: status,
      default: 'Looking for',
    },
    city: {
      type: String,
      nullable: true,
    },
    about: {
      type: String,
      nullable: true,
      default: '',
      maxlength: 1500,
    },
    position: {
      type: String,
      nullable: true,
      enum: positions,
    },
    tags: {
      type: [String],
      nullable: true,
      trim: true,
      default: [],
    },
    salary: {
      type: Number,
      nullable: true,
      min: 10,
      max: 1000,
    },
    avatar: {
      type: String,
      nullable: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      email: this.email,
      userId: this._id.toString(),
    },
    process.env.SECRETKEY,
    { expiresIn: '1h' }
  );
};

UserSchema.pre('save', async function (next) {
  this.password = await this.hashPassword(this.password);
  next();
});

module.exports = mongoose.model('User', UserSchema);
