let User = require("../models/User");
let catchAsync = require("../utils/catchAsync");

exports.signUp = catchAsync(async (req, res, next) => {
  let { username, email, password, passwordConfirm } = req.body;
  let user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});
