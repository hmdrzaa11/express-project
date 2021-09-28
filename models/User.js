let { Schema, model } = require("mongoose");
let { default: validator } = require("validator");
let bcrypt = require("bcryptjs");

let userSchema = new Schema(
  {
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
      },
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret["password"];
      },
    },
  }
);

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

//method for checking password
userSchema.methods.correctPassword = async function (rawPass) {
  return await bcrypt.compare(rawPass, this.password);
};

//check to see if password changed recently
userSchema.methods.isPasswordChangedRecently = function (jwtTime) {
  if (!this.passwordChangedAt) return false;
  let passwordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000);
  return passwordChangedAt > jwtTime;
};

//pre-save check for passwordChangedAt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date() - 1000; //make sure this time be less then JWT that will be generated after
  next();
});

//exclude delete users
userSchema.pre(/^find/, function (next) {
  this.find({});
});

let User = model("User", userSchema);

module.exports = User;
