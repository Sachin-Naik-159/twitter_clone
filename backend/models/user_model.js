const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    location: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    followers: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;
