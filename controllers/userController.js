let User = require("../models/User");
let catchAsync = require("../utils/catchAsync");
let jwt = require("jsonwebtoken");
let AppError = require("../utils/apiErrors");

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

exports.signin = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("please provide email and password", 400));
  //find user based on the email
  let user = await User.findOne({ email });
  //check the existence of user and also password correctness
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  //all good send token
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }

  if (!token)
    return next(
      new AppError("you are not logged in , please login to get access", 401)
    );

  // verify the token
  let { id, iat } = jwt.verify(token, process.env.JWT_SECRET);

  // find user
  let user = await User.findById(id);

  if (!user)
    return next(
      new AppError("the user belong to this token no longer exists", 401)
    );

  //check if user changed password after token was issued
  if (user.isPasswordChangedRecently(iat)) {
    return next(
      new AppError("user recently changed password ,please login again", 401)
    );
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you don't have permission to perform this action", 403)
      );
    }
    next();
  };
};
