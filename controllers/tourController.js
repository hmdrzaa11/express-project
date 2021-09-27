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

exports.getSingleTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError("tour not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
    runValidators: true,
    new: true,
  });
  if (!tour) return next(new AppError("tour not found", 404));
  res.json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  let stats = await Tour.aggregate([
    {
      $match: {
        secretTour: { $ne: true },
      },
    },
    {
      $group: {
        _id: "$difficulty",
        total: { $sum: 1 },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);
  res.json({
    status: "success",
    data: {
      stats,
    },
  });
});
