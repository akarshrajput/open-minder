const express = require("express");
const commentController = require("../controller/commentController");
const authController = require("./../controller/authController");
// const authController = require("./../controller/authController");
const router = express.Router({ mergeParams: true });

router.use(authController.protect); // After this line all the routers will be protected by authController.protect

router
  .route("/")
  .get(commentController.getAllComments)
  .post(authController.restrictTo("user"), commentController.createComment);
router
  .route("/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);
module.exports = router;
