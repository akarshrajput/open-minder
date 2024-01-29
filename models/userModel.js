const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  bio: {
    type: String,
    maxlength: [100, "Bio must not greater than 100 words"],
    default: "Not updated",
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // It will be saved to database but will never appear for get request
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Pre middleware to encrypt the passwords
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only run this function if the password is modified.
  // Hash password with code of 12 (default is 10)
  this.password = await bcrypt.hash(this.password, 12);
  // Delete password confirm
  this.passwordConfirm = undefined;
  next();
});

// To create "passowrdChangedAt" field when password is changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query middleware to find only that users whose active field is not equal to false
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Instance Method to compare candidatePassword(from user input for Login) with userPassword(hashed password stored in database) in "authController.js"
// Instance Method will be avilable on all users document
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance to check if user has changed password after token is issued for protecting routes
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    // Return true if password changed after token created
    return JWTTimestamp < changedTimestamp;
  }
  // False means password not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // resetToken -> Random Token , passwordResetTokern -> Encrypted version of Random Token(which is saved to database)
  // console.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

  return resetToken; // We will use unencrypted token for email and store encrypted token in database
};

userSchema.virtual("username").get(function () {
  const a = this.name.split(" ").join("").toLowerCase();
  return a;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
