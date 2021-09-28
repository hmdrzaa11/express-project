let router = require("express").Router();
let tourController = require("../controllers/tourController");
let userController = require("../controllers/userController");

router.get("/stats", tourController.getTourStats);

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

router.get("/add-guide/:tourId/:userId", tourController.addGuidesToTour);

module.exports = router;
