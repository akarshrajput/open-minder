const catchAsync = require("../utils/catchAsync");
const Bookmark = require("./../models/bookmarkModel");

exports.getAllBookmarks = catchAsync(async (req, res, next) => {
  const bookmarks = await Bookmark.find();
  res.status(200).json({
    status: "success",
    data: {
      bookmarks,
    },
  });
});

exports.createBookmark = catchAsync(async (req, res, next) => {
  const newBookmark = Bookmark.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      bookmark: newBookmark,
    },
  });
});
