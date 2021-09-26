let { Schema, model } = require("mongoose");
let { default: validator } = require("validator");
let bcrypt = require("bcryptjs");

let userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    lowercase: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message(props) {
        return `"${props.value}" is not a valid email address`;
      },
    },
  },

  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "password must be at least 8 chars length"],
    trim: true,
  },

  passwordConfirm: {
    type: String,
    required: [true, "passwordConfirm is required"],
    validate: {
      validator(value) {
        return value === this.password;
      },
      message: "password and passwordConfirm do not match",
    },
  },
  photo: String,
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "invalid role",
      default: "user",
    },
  },
});

//hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  let hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  this.passwordConfirm = undefined;
  next();
});

let User = model("User", userSchema);

module.exports = User;
