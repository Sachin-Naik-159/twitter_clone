var jwt = require("jsonwebtoken");
const UserModel = require("../models/user_model");
const dotenv = require("dotenv");

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "User not logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "User not logged in" });
    }
    const { _id } = payload;
    UserModel.findById(_id).then((dbuser) => {
      req.user = dbuser;
      next();
    });
  });
};
