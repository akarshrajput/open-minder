const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     // Filename = user-uderId-timestamp.jpeg -> So that we will get different name for all images
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // Check if the uploaded file is image, if it is image we pass true in callback else false
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  try {
    // 1) Create Error if user is trying to change password
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password updates. Please use /updateMyPassword.",
      });
    }

    // 2) Filter out unwanted field names that are not allowed to be updated
    const filterBody = filterObj(req.body, "name", "email", "bio");
    // Saving image name to database
    if (req.file) filterBody.photo = req.file.filename;

    // 3) Update user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updateUser,
      },
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);

      return res.status(400).json({
        status: "fail",
        message: `Validation error: ${errors.join(". ")}`,
      });
    }

    // Handle other types of errors
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Function to delete the user account by setting "active:false" in userSchema
exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.getallUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

// Do not update password using this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
