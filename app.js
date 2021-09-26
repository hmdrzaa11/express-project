let express = require("express");
let usersRouter = require("./routes/userRoutes");

let app = express();

//middlewares
app.use(express.json());

app.use("/api/v1/users", usersRouter);

module.exports = app;
