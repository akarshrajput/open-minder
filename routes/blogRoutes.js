const express = require("express");
const blogController = require("../controller/blogController");
const authController = require("./../controller/authController");
// const commentController = require("./../controller/commentController");
const commentRouter = require("./../routes/commentRoutes");
const router = express.Router();

router.use("/:blogId/comments", commentRouter);

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(authController.protect, blogController.createBlog);
router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(authController.protect, blogController.updateBlog)
  .delete(authController.protect, blogController.deleteBlog);

// router
//   .route("/:blogId/comments")
//   .post(authController.protect, commentController.createComment);
module.exports = router;
