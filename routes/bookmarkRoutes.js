const express = require("express");
const bookmarkController = require("../controller/bookmarkController");
// const authController = require("./../controller/authController");
const router = express.Router();
router
  .route("/")
  .get(bookmarkController.getAllBookmarks)
  .post(bookmarkController.createBookmark);
// router
//   .route("/:id")
//   .get(blogController.getBlog)
//   .patch(blogController.updateBlog)
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guides"),
//     blogController.deleteBlog
//   );
module.exports = router;
