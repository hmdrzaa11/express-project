let router = require("express").Router();
let tourController = require("../controllers/tourController");

router
  .route("/")
  .post(tourController.createTour)
  .get(tourController.getAllTours);

router.route("/:tourId").get(tourController.getSingleTour);

module.exports = router;
