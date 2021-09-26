let router = require("express").Router();
let userController = require("../controllers/userController");

//Signup
router.post("/sign-up", userController.signUp);

module.exports = router;
