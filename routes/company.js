const express = require("express");
const companyController = require("../controllers/companyController");
const isAuth = require("../middleware/isAuth");
const advancedResponse = require("../middleware/advancedResponse");
const Company = require("../models/Company");
const { authorize } = require("../middleware/isRole");

const router = express.Router({ mergeParams: true });
const vacancyRouter = require('./vacancy');

router.get("/", isAuth, advancedResponse(Company), companyController.getCompanies)
router.post("/add-company", isAuth, authorize("Employer"), companyController.addCompany);
router.use('/:companyUrl/vacancies', vacancyRouter);
router
  .route("/:companyUrl")
  .get(isAuth, companyController.findCompanyByUrl)
  .put(isAuth, companyController.followOrUnfollow);

module.exports = router;
