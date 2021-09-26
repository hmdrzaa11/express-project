let express = require("express");
let usersRouter = require("./routes/userRoutes");

let app = express();

app.use("/api/v1/users", usersRouter);

module.exports = app;
