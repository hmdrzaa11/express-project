let faker = require("faker");
let path = require("path");
let Tour = require("../models/Tour");

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

let seedTourDb = async () => {
  let tours = Array.from({ length: 10 }).map((_) =>
    Tour.create({
      name: faker.name.title(),
      duration: faker.datatype.number(20),
      maxGroupSize: faker.datatype.number(20),
      difficulty: faker.random.arrayElement(["easy", "difficult", "medium"]),
      ratingsAverage: faker.datatype.float({ min: 1, max: 5, precision: 1 }),
      price: faker.finance.amount(),
      summary: faker.lorem.paragraph(3),
      imageCover: faker.image.imageUrl(),
      startLocation: {
        type: "Point",
        coordinates: [faker.address.longitude(), faker.address.latitude()],
        address: faker.address.cityName(),
        description: faker.lorem.paragraph(),
      },
    })
  );
  await Promise.all(tours);
};

if (command === "--import") {
  (async function () {
    try {
      await seedTourDb();
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })();
} else if (command === "--delete") {
  (async function () {
    try {
      await Tour.deleteMany({});
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  })();
}
