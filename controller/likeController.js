const catchAsync = require("../utils/catchAsync");
const Like = require("./../models/likeModel");

exports.getAllLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find();
  res.status(200).json({
    status: "success",
    data: {
      likes,
    },
  });
});

exports.createLike = catchAsync(async (req, res, next) => {
  const newLike = Like.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      like: newLike,
    },
  });
});
