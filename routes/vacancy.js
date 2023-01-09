const express = require("express");
const vacancyController = require("../controllers/vacancyController");
const isAuth = require("../middleware/isAuth");
const advancedResponse = require("../middleware/advancedResponse");
const Vacancy = require("../models/Vacancy");

const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth, advancedResponse(Vacancy), vacancyController.getVacancies).post(isAuth, vacancyController.addVacancy)
router.route('/dashboard').get(isAuth, vacancyController.getVacanciesV2)
router.route('/:itemId').get(isAuth, vacancyController.get).delete(isAuth, vacancyController.delete2)

module.exports = router;
