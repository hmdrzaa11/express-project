let express = require("express");
let rateLimit = require("express-rate-limit");
let mongoSanitizer = require("express-mongo-sanitize");
let xss = require("xss-clean");
let hpp = require("hpp");
let helmet = require("helmet");
let AppError = require("./utils/apiErrors");
let globalErrorHandler = require("./controllers/errorController");
let usersRouter = require("./routes/userRoutes");
let tourRouter = require("./routes/tourRoutes");

let app = express();

//middlewares
app.use(helmet());

app.use(
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "to many request from this IP, please try in 1 hour later",
  })
);
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitizer());
app.use(xss());
app.use(hpp());

//////////////////////////////////////

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/tours", tourRouter);

//404 route
app.all("*", (req, res, next) => {
  next(new AppError(`Can not file ${req.originalUrl} on this server`, 404));
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
