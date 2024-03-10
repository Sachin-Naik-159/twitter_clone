const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;
const tweetSchema = new Schema(
  {
    content: {
      type: String,
    },
    contentPic: {
      type: String,
      default: null,
    },
    tweetedBy: {
      type: ObjectId,
      ref: "UserModel",
    },
    likes: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    comments: [
      {
        _id: { type: ObjectId, ref: "TweetModel" },
        commentText: String,
        commentedBy: { type: ObjectId, ref: "UserModel" },
        commentedAt: { type: Date, default: Date.now },
      },
    ],
    retweetBy: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    replies: [
      {
        type: ObjectId,
        ref: "TweetModel",
      },
    ],

    replyTo: {
      type: ObjectId,
      default: null,
      ref: "TweetModel",
    },
    retweetUser: { type: String, default: null },

    root: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TweetModel = mongoose.model("TweetModel", tweetSchema);
module.exports = TweetModel;
