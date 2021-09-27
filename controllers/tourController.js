let catchAsync = require("../utils/catchAsync");
let AppError = require("../utils/apiErrors");
let Tour = require("../models/Tour");

exports.createTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  let allTours = await Tour.find();
  res.status(200).json({
    status: "success",
    data: {
      tours: allTours,
    },
  });
});
