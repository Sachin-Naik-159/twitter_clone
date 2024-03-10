const TweetModel = require("../models/tweet_model");

//Get all tweets
const getAllTweet = async (req, res) => {
  try {
    let tweets = await TweetModel.find({ root: true })
      .populate("tweetedBy", "_id username profilePic")
      .sort({ updatedAt: -1 });
    res.status(200).json(tweets);
  } catch (err) {
    throw err;
  }
};

//Create a Tweet
const addTweet = async (req, res) => {
  try {
    const _id = req.user._id; //id in token
    const { content, contentPic, root } = req.body;
    const newTweet = new TweetModel({
      content,
      tweetedBy: _id,
      root,
      contentPic,
    });
    const resp = await newTweet.save();
    res.status(201).json({ message: "Tweet Created", resp });
  } catch (err) {
    throw err;
  }
};

//Get a tweet
const getTweet = async (req, res) => {
  try {
    const _id = req.params.id;
    let tweetInDB = await TweetModel.findOne({ _id }).populate(
      "tweetedBy",
      "_id username profilePic"
    );
    res.status(200).json([tweetInDB]);
  } catch (err) {
    throw err;
  }
};

//Like a tweet
const like = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = req.user._id;
    let tweetInDB = await TweetModel.findOne({ _id });
    tweetInDB = tweetInDB.likes;
    let found = tweetInDB.find((data) => {
      return (
        data.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
        user.toString().replace(/ObjectId\("(.*)"\)/, "$1")
      );
    });
    if (!found) {
      TweetModel.findByIdAndUpdate(
        _id,
        { $push: { likes: user } },
        { new: true }
      ).exec();
      res.status(200).json({ message: "Liked" });
    } else {
      res.status(200).json({ message: "Already Liked" });
    }
  } catch (err) {
    throw err;
  }
};

//Dislike a tweet
const dislike = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = req.user._id;
    let tweetInDB = await TweetModel.findOne({ _id });
    tweetInDB = tweetInDB.likes;
    let found = tweetInDB.find((data) => {
      return (
        data.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
        user.toString().replace(/ObjectId\("(.*)"\)/, "$1")
      );
    });

    if (found) {
      await TweetModel.findByIdAndUpdate(
        _id,
        { $pull: { likes: user } },
        { new: true }
      ).exec();
      res.status(200).json({ message: "DisLiked" });
    } else {
      res.status(200).json({ message: "Not Liked" });
    }
  } catch (err) {
    throw err;
  }
};

//Reply a tweet
const reply = async (req, res) => {
  try {
    let user = req.user._id;
    let content = req.body.content;
    const _id = req.params.id;
    const newTweet = new TweetModel({
      content,
      tweetedBy: user,
      replyTo: _id,
    });
    const resp = await newTweet.save();
    let commentsData = {
      _id: resp._id,
      commentText: resp.content,
      commentedBy: resp.tweetedBy,
    };
    const repres = await TweetModel.findByIdAndUpdate(
      _id,
      { $push: { replies: resp._id, comments: commentsData } },
      { new: true }
    ).exec();
    res.status(201).json({ message: "Reply Tweet Created", repres });
  } catch (err) {
    throw err;
  }
};

//Retweet a tweet
const retweet = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = req.user._id;
    let name = req.user.username;
    let tweetInDB = await TweetModel.findOne({ _id });
    tweetInDB = tweetInDB.retweetBy;
    let found = tweetInDB.find((data) => {
      return (
        data.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
        user.toString().replace(/ObjectId\("(.*)"\)/, "$1")
      );
    });
    if (!found) {
      TweetModel.findByIdAndUpdate(
        _id,
        { $push: { retweetBy: user }, $set: { retweetUser: name } },
        { new: true }
      ).exec();
      res.status(200).json({ message: "Retweeted" });
    } else {
      res.status(200).json({ message: "Already Retweeted" });
    }
  } catch (err) {
    throw err;
  }
};

//Delete a tweet
const deleteTweet = async (req, res) => {
  try {
    const _id = req.params.id;
    let user = req.user._id;
    let tweetInDB = await TweetModel.findOne({ _id });

    if (tweetInDB) {
      //Update replies & comments
      let repliedOn = tweetInDB.replyTo;
      await TweetModel.findByIdAndUpdate(
        repliedOn,
        { $pull: { comments: { _id: _id }, replies: _id } },
        { multi: true },
        { new: true }
      ).exec();
      //Deleating tweet itself
      tweetAuth = tweetInDB.tweetedBy;
      user = user.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      tweetAuth = tweetAuth.toString().replace(/ObjectId\("(.*)"\)/, "$1");
      if (user === tweetAuth) {
        await TweetModel.findOneAndDelete({ _id }).exec();
        res.status(200).json({ message: "Deleated Tweet" });
      } else {
        res.status(200).json({ message: "Not Author" });
      }
    } else res.status(400).json({ error: "Not Found" });
  } catch (err) {
    throw err;
  }
};

//Get all replies to a tweet
const replies = async (req, res) => {
  try {
    let _id = req.params.id;
    let tweets = await TweetModel.find({ replyTo: _id })
      .populate("tweetedBy", "_id username profilePic")
      .sort({ updatedAt: -1 });
    res.status(200).json(tweets);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllTweet,
  addTweet,
  getTweet,
  like,
  dislike,
  reply,
  deleteTweet,
  retweet,
  replies,
};
