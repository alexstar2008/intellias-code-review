const express = require("express");
const usersController = require("../controllers/usersController");
const User = require("../models/User");
const isAuth = require("../middleware/isAuth");
const advancedResponse = require("../middleware/advancedResponse");

const router = express.Router();

router.get("/", advancedResponse(User), isAuth, usersController.getUsers);
router.get("/:userId", isAuth, usersController.getUser);
router.put("/edit-photo", isAuth, usersController.updatePhoto);
router.put("/update-user", isAuth, usersController.updateDetails);

module.exports = router;
