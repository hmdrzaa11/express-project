let faker = require("faker");
let path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});
let mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to DB..."))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

let command = process.argv[2];

console.log("all good", command);
