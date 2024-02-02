const axios = require("axios");
const catchAsync = require("./../utils/catchAsync");
const Blog = require("./../models/blogModel");

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get blog data from collection/API
  const responseOne = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&limit=8",
  });
  const firstComp = responseOne.data.data.blogs;

  const responseTwo = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-createdAt&limit=20",
  });
  const secondComp = responseTwo.data.data.blogs;

  const responseThree = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&categories=Book&limit=4",
  });
  const story = responseThree.data.data.blogs;

  const responseFour = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&categories=Health&limit=4",
  });
  const health = responseFour.data.data.blogs;

  const responseFive = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&categories=Space&limit=4",
  });
  const space = responseFive.data.data.blogs;

  const responseSix = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&categories=Coding&limit=4",
  });
  const coding = responseSix.data.data.blogs;

  const responseSeven = await axios({
    method: "GET",
    url: "http://127.0.0.1:8000/api/v1/blogs?sort=-views&categories=Education&limit=4",
  });
  const education = responseSeven.data.data.blogs;
  // 2) Build Template
  // 3) Render that template using tour data from 1).
  res.status(200).render("overview", {
    title: "Open Minder : Beyond Boundaries",
    firstComp,
    secondComp,
    story,
    health,
    space,
    coding,
    education,
  });
  // console.log(blogs);
});

exports.getBlog = catchAsync(async (req, res) => {
  // 1) Get the data for the requested tour (includeing reviews and guide)
  const blogId = req.params.id;
  const response = await axios({
    method: "GET",
    url: `http://127.0.0.1:8000/api/v1/blogs/${blogId}`,
  });
  const blog = response.data.data.blog;
  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("blog", {
    title: blog.heading,
    blog,
  });
  // console.log(blog);
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Login your account",
  });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render("signup", {
    title: "Make new account",
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
};

exports.getUser = catchAsync(async (req, res) => {
  // 1) Get the data for the requested tour (includeing reviews and guide)
  const userId = req.params.id;
  const response = await axios({
    method: "GET",
    url: `http://127.0.0.1:8000/api/v1/users/${userId}`,
  });
  getUser = response.data.data.user;
  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("user", {
    title: getUser.name,
    getUser,
  });
  // console.log(blog);
});

exports.writeBlog = (req, res) => {
  res.status(200).render("writeblog", {
    title: "Write your mind!",
  });
};
