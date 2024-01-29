const express = require("express");
const viewController = require("./../controller/viewsController");
const authController = require("./../controller/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/blog/:id", authController.isLoggedIn, viewController.getBlog);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/user/:id", authController.isLoggedIn, viewController.getUser);
router.get("/write/:id", authController.isLoggedIn, viewController.writeBlog);

module.exports = router;
