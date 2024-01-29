const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middlewares

bookmarkSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
  }).populate({
    path: "article",
  });

  next();
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
