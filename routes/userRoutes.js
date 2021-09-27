let router = require("express").Router();
let userController = require("../controllers/userController");

//Signup
router.post("/sign-up", userController.signUp);

//Signin
router.post("/sign-in", userController.signin);

//update password
router.patch(
  "/update-password",
  userController.protect,
  userController.updatePassword
);

module.exports = router;
