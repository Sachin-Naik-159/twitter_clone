const express = require("express");
const protectectedResource = require("../middleware/protectectedResource");
const {
  updatePic,
  getUser,
  follow,
  unfollow,
  editUser,
  tweets,
} = require("../controllers/user_update_controller");

const router = express.Router();

// User details
router
  .route("/:id")
  .get(getUser)
  .put(protectectedResource, editUser)
  .post(protectectedResource, updatePic);
router.route("/:id/follow").put(protectectedResource, follow);
router.route("/:id/unfollow").put(protectectedResource, unfollow);
router.route("/:id/tweets").get(protectectedResource, tweets);

module.exports = router;
