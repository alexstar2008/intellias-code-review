const mongoose = require('mongoose');

const { emailValidRegex, worktype, positions } = require('../utils/modelTypes');

const VacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxLength: [40, 'Entered title is too long'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: 10000,
    },
    worktype: {
      type: String,
      enum: worktype,
      default: 'Office',
    },
    salary: {
      type: Number,
      nullable: true,
      min: 10,
      max: 1000,
    },
    position: {
      type: String,
      nullable: true,
      enum: [...positions, null],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [emailValidRegex, 'Please add a valid email'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    companyUrl: {
      type: mongoose.Schema.Types.String,
      ref: 'Company',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vacancy', VacancySchema);
