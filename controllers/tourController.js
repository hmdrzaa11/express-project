let catchAsync = require("../utils/catchAsync");
let AppError = require("../utils/apiErrors");
let Tour = require("../models/Tour");
let ApiFeatures = require("../utils/ApiFeature");

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
  let api = new ApiFeatures(Tour.find(), req.query);

  let allTours = await api.filter().sort().limitFields().paginate()
    .mongooseQuery;
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

exports.addGuidesToTour = catchAsync(async (req, res, next) => {
  let tourId = req.params.tourId;
  let userId = req.params.userId;
  let tour = await Tour.findByIdAndUpdate(
    tourId,
    {
      $push: { guides: [userId] },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!tour) return next(new AppError("no tour with this ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});
