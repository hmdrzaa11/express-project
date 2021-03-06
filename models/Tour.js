let { Schema, model } = require("mongoose");
let { default: slugify } = require("slugify");

let tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name of the tour is required"],
      trim: true,
      minlength: [10, "name of the tour can not be less than 10 chars"],
      maxlength: [40, "name of the tour can not be more than 40 chars"],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "tour must have a specified duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "tour must have a defined maxGroupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "difficulty of the tour must be define"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty is either : easy , medium , difficult",
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "ratingsAverage can not be less than 1"],
      max: [5, "ratingsAverage can not be greater than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price of the tour is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(discount) {
          return discount < this.price;
        },
        message: "discount can not be greater than price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "summary is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "imageCover is required"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    guides: [{ type: Schema.Types.ObjectId, ref: "User" }],
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
);

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//duration in weeks
tourSchema.virtual("durationInWeeks").get(function () {
  return Math.floor(this.duration / 7);
});

//remove secret tour from aggregation
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  next();
});

let Tour = model("Tour", tourSchema);

module.exports = Tour;
