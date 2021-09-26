let express = require("express");
let app = express();

app.get("/", (req, res) => {
  res.send({
    msg: "hello world!",
  });
});

module.exports = app;
