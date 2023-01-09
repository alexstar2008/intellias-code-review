const Company = require("../models/Company");
const Vacancy = require("../models/Vacancy");
const ErrorResponse = require("../utils/errorResponse");

exports.getVacancies = async id => {
  return id
    ? await Vacancy.find({ companyUrl: id }).sort("-createdAt")
    : await Vacancy.find();
};

exports.getVacancy = async id => {
  const vacancy = await Vacancy.findOne({ _id: id });
  if (!vacancy) {
    throw new ErrorResponse(`Vacancy not found`, 404);
  }
  return vacancy;
};

exports.addVacancy = async req => {
  if (!req.params.companyUrl) {
    throw new ErrorResponse(`Company not found`, 404);
  }
  const company = await Company.findOne({ companyUrl: req.params.companyUrl });

  if (!company) {
    throw new ErrorResponse(`Company not found`, 404);
  }

  if (company.author.toString() !== req.user.id.toString()) {
    throw new ErrorResponse(`Permission denied`, 403);
  }

  const { title, description, worktype, salary, position, email } = req.body;

  return await Vacancy.create({
    title,
    description,
    worktype,
    salary,
    position: position || null,
    email,
    author: req.user.id,
    companyUrl: req.params.companyUrl,
    company: company.id,
  });
};

exports.findFollowVacancies = async (user, query) => {
  const companies = await Company.find()
    .where("followers")
    .in([user.id])
    .select("companyUrl");
  let result = companies.map(company => company.companyUrl);
  const total = await Vacancy.find()
    .where("companyUrl")
    .in(result)
    .countDocuments();
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const vacancy = await Vacancy.find()
    .where("companyUrl")
    .in(result)
    .skip(startIndex)
    .limit(limit)
    .sort("-createdAt")
    .populate("company");
  const pagination = {
    total: Math.ceil(total / limit),
  };
  return {
    count: vacancy.length,
    pagination,
    data: vacancy,
  };
};

exports.deleteVacancy = async id => {
  const vacancy = Vacancy.findById(id);
  if (!vacancy) {
    throw new ErrorResponse(`Vacancy not found with id of ${id}`, 404);
  }
  return await Vacancy.deleteOne({ _id: id });
};
