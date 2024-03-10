const express = require("express");
const { addUser, login } = require("../controllers/auth_controller");

const router = express.Router();

// User details
router.route("/").post(addUser);
router.route("/login").post(login);

module.exports = router;
