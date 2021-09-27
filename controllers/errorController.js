let AppError = require("../utils/apiErrors");

let sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

let handleDuplicatedValues = (err) => {
  let duplicatedValue = err.message.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `duplicated value : ${duplicatedValue}, please provide another value`,
    400
  );
};

let handleCastIdError = (err) => {
  let message = `Invalid ${err.path} : ${err.values} `;
  return new AppError(message, 400);
};

let handleValidationError = (err) => {
  let messages = Object.keys(err.errors)
    .map((key) => err.errors[key].message)
    .join(" , ");
  return new AppError(messages, 400);
};

let sendErrorProduction = (err, res) => {
  //if the error comes from the AppError is clean to go

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //otherwise it is server error
  res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) err = handleDuplicatedValues(err);
    if (err.name === "ValidationError") err = handleValidationError(err);
    if (err.name === "CastError") err = handleCastIdError(err);
    sendErrorProduction(err, res);
  }
};
