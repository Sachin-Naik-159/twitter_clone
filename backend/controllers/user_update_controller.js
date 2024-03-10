const UserModel = require("../models/user_model");
const TweetModel = require("../models/tweet_model");

//Get single user
const getUser = async (req, res) => {
  try {
    const _id = req.params.id;
    let userInDB = await UserModel.findOne({ _id });
    userInDB.password = "";

    if (userInDB) {
      const userInfo = {
        _id: userInDB._id,
        name: userInDB.name,
        username: userInDB.username,
        email: userInDB.email,
        followers: userInDB.followers,
        following: userInDB.following,
        profilePic: userInDB.profilePic,
        createdAt: userInDB.createdAt,
        updatedAt: userInDB.updatedAt,
        dateOfBirth: userInDB.dateOfBirth,
        location: userInDB.location,
      };
      res.status(200).json({
        result: { user: userInfo },
      });
    } else {
      return res.status(401).json({ message: "User Not Found" });
    }
  } catch (err) {
    throw err;
  }
};

//Edit user detail
const editUser = async (req, res) => {
  try {
    let _id = req.params.id; //id in url
    let my = req.user._id; //id in token
    my = my.toString().replace(/ObjectId\("(.*)"\)/, "$1");

    const name = req.body.name;
    const dateOfBirth = req.body.dateOfBirth;
    const location = req.body.location;

    if (my === _id && name != "" && dateOfBirth != null && location != "") {
      UserModel.findByIdAndUpdate(
        _id,
        {
          $set: {
            name: name,
            location: location,
            dateOfBirth: dateOfBirth,
          },
        },
        { new: true }
      ).exec();
      res.status(200).json({ message: "Edit Success" });
    } else {
      return res.status(400).json({ message: "Missing data" });
    }
  } catch (err) {
    throw err;
  }
};

//Follow user
const follow = async (req, res) => {
  try {
    let other = req.params.id;
    let my = req.user._id;
    let userInDB = await UserModel.findOne({ _id: other });
    userInDB = userInDB.followers;
    let found = userInDB.find((e) => (e = my));

    my = my.toString().replace(/ObjectId\("(.*)"\)/, "$1");

    if (other == my) {
      return res.status(400).json({ message: "error" });
    } else if (found) {
      return res.status(400).json({ message: "Already Followed" });
    } else {
      UserModel.findByIdAndUpdate(
        my,
        { $push: { following: other } },
        { new: true }
      ).exec();
      UserModel.findByIdAndUpdate(
        other,
        { $push: { followers: my } },
        { new: true }
      ).exec();

      res.status(200).json({ message: "Followed" });
    }
  } catch (err) {
    throw err;
  }
};

//Unfollow user
const unfollow = async (req, res) => {
  try {
    let other = req.params.id;
    let my = req.user._id;
    let userInDB = await UserModel.findOne({ _id: other });
    userInDB = userInDB.followers;
    let found = userInDB.find((e) => (e = my));

    my = my.toString().replace(/ObjectId\("(.*)"\)/, "$1");

    if (other == my) {
      return res.status(400).json({ message: "error" });
    } else {
      if (found) {
        UserModel.findByIdAndUpdate(
          my,
          { $pull: { following: other } },
          { new: true }
        ).exec();
        UserModel.findByIdAndUpdate(
          other,
          { $pull: { followers: my } },
          { new: true }
        ).exec();

        res.status(200).json({ message: "Unfollowed" });
      } else {
        res.status(200).json({ message: "Not followed" });
      }
    }
  } catch (err) {
    throw err;
  }
};

//Update Profile pic
const updatePic = async (req, res) => {
  try {
    let _id = req.params.id; //id in url
    let my = req.user._id; //id in token
    my = my.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    profPic = req.body.profilePic;
    if (my === _id) {
      UserModel.findByIdAndUpdate(_id, {
        $set: { profilePic: String(profPic) },
      }).exec();
      res.status(200).json({ message: "Updated Profile Pic" });
    }
  } catch (err) {
    throw err;
  }
};

//Get user tweets
const tweets = async (req, res) => {
  try {
    let _id = req.params.id;
    let userTweets = await TweetModel.find({
      $or: [{ tweetedBy: _id }, { retweetBy: _id }],
    })
      .populate("tweetedBy", "_id username profilePic")
      .sort({ updatedAt: -1 });
    res.status(200).send(userTweets);
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getUser,
  editUser,
  follow,
  unfollow,
  updatePic,
  tweets,
};
