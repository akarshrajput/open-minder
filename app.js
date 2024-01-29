const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
const likeRouter = require("./routes/likeRoutes");
const bookmarkRouter = require("./routes/bookmarkRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security Headers using hemlet( always use it before all middlewares)
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 1000, // Maximum number of requests in a time limit
  windowMs: 60 * 60 * 1000, // Time limit set to 1 hour
  message: "Too many requests from this IP. Please try again later in an hour.", // Error message if user make more than 100 request in an hour
});
app.use("/api", limiter); // Limiter functio will be applied to routes which have "/api" in them (all routes here)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Used when we need data from form to server
// Parser the data from cookie
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize()); // It will remove all the dollar sign and dot to prevent from NOSQL query injection.

// Data sanitization against XSS
app.use(xss()); // Clean any user input from malicious HTML code

// Prevent parameter pollution
app.use(
  hpp({
    // whitelist: ["duration"], // We will whitelis some fields which we don't want to be parameterized in HPP
  })
); // Remove the unwanted properties

app.use(compression());

// Test Middleware
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// 2) ROUTES
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);

// Handle Error of all routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
