let express = require("express");
let usersRouter = require("./routes/userRoutes");
let AppError = require("./utils/apiErrors");

let app = express();

//middlewares
app.use(express.json());

app.use("/api/v1/users", usersRouter);

//404 route
app.all("*", (req, res, next) => {
  next(new AppError(`Can not file ${req.originalUrl} on this server`, 404));
});

module.exports = app;
