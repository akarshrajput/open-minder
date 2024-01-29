const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Comment = require("./../models/commentModel");
const factory = require("./handlerFactory");

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.blogId) filter = { blog: req.params.blogId };
  const comments = await Comment.find(filter);
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.blog) req.body.blog = req.params.blogId;
  if (!req.body.author) req.body.author = req.user.id;

  const newComment = await Comment.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
