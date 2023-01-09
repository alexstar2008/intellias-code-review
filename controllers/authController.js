const authService = require("../services/authService");
const asyncHandler = require("../middleware/async");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await authService.registerUser({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role
  });
  res.status(201).json({
    success: true,
    message: "User created.",
    userId: user._id,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { token, userId } = await authService.loginUser({
    email: req.body.email,
    password: req.body.password,
  });
  let options;
  if(process.env.NODE_ENV === 'development') {
    options = {
      httpOnly: true, // The cookie only accessible by the web server
      maxAge: 1000 * 60 * 60, // every 1 hour
    }
  }
  else options = {
    httpOnly: true, // The cookie only accessible by the web server
    maxAge: 1000 * 60 * 60, // every 1 hour
    origin: process.env.CLIENT_URI,
    sameSite: 'None',
    secure: true
  }
  res.cookie('accessToken', token, options)
  res.status(200).json({
    success: true,
    userId
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('accessToken');
  res.status(200).json({
    success: true
  })
});

exports.me = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    user: req.user
  });
});


