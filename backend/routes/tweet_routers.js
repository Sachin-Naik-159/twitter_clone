const express = require("express");
const protectectedResource = require("../middleware/protectectedResource");
const {
  addTweet,
  getTweet,
  like,
  dislike,
  reply,
  getAllTweet,
  deleteTweet,
  retweet,
  replies,
} = require("../controllers/tweet_controller");

const router = express.Router();

router
  .route("/")
  .post(protectectedResource, addTweet)
  .get(protectectedResource, getAllTweet);
router
  .route("/:id")
  .get(protectectedResource, getTweet)
  .delete(protectectedResource, deleteTweet);
router.route("/:id/retweet").post(protectectedResource, retweet);
router.route("/:id/like").post(protectectedResource, like);
router.route("/:id/dislike").post(protectectedResource, dislike);
router.route("/:id/reply").post(protectectedResource, reply);

router.get("/replies/:id", protectectedResource, replies);

module.exports = router;
