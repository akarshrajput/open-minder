const express = require("express");
const likeController = require("../controller/likeController");
// const authController = require("./../controller/authController");
const router = express.Router();
router
  .route("/")
  .get(likeController.getAllLikes)
  .post(likeController.createLike);
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
