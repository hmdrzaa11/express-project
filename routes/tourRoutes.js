let router = require("express").Router();
let tourController = require("../controllers/tourController");
let userController = require("../controllers/userController");

router
  .route("/")
  .post(tourController.createTour)
  .get(tourController.getAllTours);

router
  .route("/:tourId")
  .get(tourController.getSingleTour)
  .patch(
    userController.protect,
    userController.restrictTo("admin"),
    tourController.updateTour
  );

module.exports = router;
