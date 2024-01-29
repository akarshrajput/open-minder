const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
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

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name",
  });

  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
