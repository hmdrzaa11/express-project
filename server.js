require("dotenv").config();
let mongoose = require("mongoose");
let app = require("./app");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("db is in the house!"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
