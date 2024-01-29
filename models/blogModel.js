const mongoose = require("mongoose");
const slugify = require("slugify");
const blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Blog must have heading"],
      trim: true,
      minlength: [40, "A blog title must have more than 40 characters"],
      maxlength: [80, "A blog title must have less than 80 characters"],
    },
    description: {
      type: String,
      required: [true, "Blog must have description"],
      trim: true,
      minlength: [60, "A blog description must have more than 60 characters"],
      maxlength: [300, "A blog description must have less than 300 characters"],
    },
    featuredImage: {
      type: "String",
      // required: [true, "Blog must have a featured photo"],
    },
    content: {
      type: String,
      required: [true, "Blog must have a Content"],
      minlength: [100, "Content must have more than 100 characters"],
      maxlength: [1500, "Content must have less than 1500 characters"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        maxlength: [20, "Tags not valid"],
        required: [true, "Blog must have tag"],
        minlength: [2, "Not a valid tag"],
      },
    ],
    categories: [
      {
        type: String,
        required: [true, "Blog must have a category"],
        minlength: [2, "Select atleast one Category"],
        enum: [
          "Art",
          "Artificial Intelligence",
          "Agriculture",
          "Book",
          "Career",
          "Celebrity",
          "Coding",
          "Creativity",
          "Cultural",
          "Discoveries",
          "Education",
          "Environment",
          "Entrepreneurship",
          "Fashion",
          "Finance",
          "Fitness",
          "Food",
          "Health",
          "History",
          "Hacks",
          "Home",
          "Inspirational",
          "Meditation",
          "Motivational",
          "Movie",
          "Music",
          "Parenting",
          "Personal Growth",
          "Photography",
          "Politics",
          "Productivity",
          "Programming",
          "Psychology",
          "Relationships",
          "Review",
          "Science",
          "Self-Care",
          "Social",
          "Social Media",
          "Space",
          "Sports",
          "Strategies",
          "Technology",
          "Tips",
          "Training",
          "Travel",
          "Wildlife",
        ],
      },
    ],
  },
  // We will use this to show that fields also who are not saved to database
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "blog",
  localField: "_id",
});

// Define virtual fields for month, year, and date
blogSchema.virtual("createdMonth").get(function () {
  return this.createdAt.toLocaleString("en-US", { month: "short" });
});

blogSchema.virtual("createdYear").get(function () {
  return this.createdAt.getFullYear();
});

blogSchema.virtual("createdDate").get(function () {
  return this.createdAt.getDate();
});

// Virtual Field for readTime
blogSchema.virtual("readTime").get(function () {
  // Assuming an average reading speed of 200 words per minute
  const wordsPerMinute = 120;
  const wordCount = this.content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readTimeMinutes}`;
});

blogSchema.virtual("slug").get(function () {
  return slugify(this.heading, { lower: true, remove: /[*+~.()'"!:@]/g });
});

blogSchema.virtual("shortTitle").get(function () {
  return `${this.heading.slice(0, 60)}...`;
  // const a = this.heading.split(" ");
  // const b = `${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${a[5]} ${a[6]} ${a[7]} ...`;
  // return b;
});

blogSchema.virtual("shortDescription").get(function () {
  return `${this.description.slice(0, 130)}...`;
  // const a = this.description.split(" ");
  // const b = `${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${a[5]} ${a[6]} ${a[7]} ...`;
  // return b;
});

blogSchema.virtual("tagString").get(function () {
  const a = this.tags;
  const b = `#${a[0]}`.toLowerCase();
  return b;
});

blogSchema.virtual("dateString").get(function () {
  const a = this.createdAt.toLocaleString("en-US", { month: "short" });
  const b = this.createdAt.getDate();
  return `${a} ${b}`;
});

blogSchema.virtual("categoryString").get(function () {
  return this.categories[0];
});

blogSchema.virtual("blogContent").get(function () {
  const contentWithNewLines = this.content.replace(/(\.{3})/g, ".\n\n");
  return contentWithNewLines;
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name photo verified",
  });
  next();
});

// Define a middleware to increment views when a user views the article
// blogSchema.pre("findOneAndUpdate", async function (next) {
//   // 'this' refers to the query object
//   const articleId = this.getQuery()._id;

//   // Increment the views field
//   await mongoose
//     .model("Blog")
//     .updateOne({ _id: articleId }, { $inc: { views: 1 } });

//   next();
// });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
