let router = require("express").Router();
let userController = require("../controllers/userController");

//Signup
router.post("/sign-up", userController.signUp);

//Signin
router.post("/sign-in", userController.signin);

module.exports = router;
