const express = require('express');
const authController = require('../controllers/authController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/sign-in', authController.login)
router.post('/sign-up', authController.register)
router.post('/sign-out', authController.logout);
router.get('/me', isAuth, authController.me)

module.exports = router;
