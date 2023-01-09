const vacancyService = require("../services/vacancyService");
const asyncHandler = require("../middleware/async");
const advancedResponse = require("../middleware/advancedResponse");

exports.getVacancies = asyncHandler(async (req, res, next) => {
  let vacancies;
  if (req.params.companyUrl) {
    vacancies = await vacancyService.getVacancies(req.params.companyUrl);
    res
      .status(200)
      .json({ success: true, count: vacancies.length, data: vacancies });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getVacanciesV2 = asyncHandler(async (req, res, next) => {
  const companies = await vacancyService.findFollowVacancies(req.user, req.query);
  res.status(200).json({...companies, success: true})
});

exports.get = asyncHandler(async (req, res, next) => {
  const vacancy = await vacancyService.getVacancy(req.params.itemId);

  res.status(200).json({ success: true, data: vacancy });
});

exports.addVacancy = asyncHandler(async (req, res, next) => {
  const vacancy = await vacancyService.addVacancy(req);

  res.status(200).json({ success: true, data: vacancy });
});

exports.delete2 = asyncHandler(async (req, res, next) => {
  await vacancyService.deleteVacancy(req.params.vacancyId);

  res.status(200).json({
    success: true,
    data: {},
  });
});
