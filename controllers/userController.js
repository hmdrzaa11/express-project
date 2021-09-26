let User = require("../models/User");

exports.signUp = async (req, res) => {
  try {
    let { username, email, password, passwordConfirm } = req.body;
    let user = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
