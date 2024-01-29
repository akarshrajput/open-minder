const Blog = require("./../models/blogModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query.populate("comments");
  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("comments");

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }
  blog.views += 1;
  await blog.save();
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  const newBlog = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: newBlog,
    },
  });
});

exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
