const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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

likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
  }).populate({
    path: "article",
  });

  next();
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
