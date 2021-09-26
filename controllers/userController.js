let User = require("../models/User");
let catchAsync = require("../utils/catchAsync");
let jwt = require("jsonwebtoken");

let createAndSendToken = (user, statusCode, res) => {
  let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  let { username, email, password, passwordConfirm } = req.body;
  let user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
  });
  createAndSendToken(user, 201, res);
});
