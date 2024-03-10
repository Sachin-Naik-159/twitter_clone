const UserModel = require("../models/user_model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;

//Hashing password
const hashPass = async (pass) => {
  try {
    return await bcrypt.hash(pass, 10);
  } catch (err) {
    throw err;
  }
};

//Compare password
const comparePass = async (pass, dbpass) => {
  try {
    return await bcrypt.compare(pass, dbpass);
  } catch (err) {
    throw err;
  }
};

//Add user data
const addUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All the fields are mandatory" });
    }

    if (await UserModel.findOne({ email })) {
      return res.status(500).json({ message: "email id already reqistered" });
    } else if (await UserModel.findOne({ username })) {
      return res.status(500).json({ message: "username already reqistered" });
    } else {
      const newUser = new UserModel({
        name,
        username,
        email,
        password: await hashPass(password),
      });
      const resp = await newUser.save();
      res.status(201).json({ message: "User Created", resp });
    }
  } catch (err) {
    throw err;
  }
};

//Login code
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ message: "Mandatory fields are empty" });
    } else {
      let userInDB = await UserModel.findOne({ email });
      if (!userInDB) {
        return res.status(401).json({ message: "Invalid Credentials" });
      } else {
        const match = await comparePass(password, userInDB.password);
        if (match) {
          const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_KEY);
          const userInfo = {
            _id: userInDB._id,
            name: userInDB.name,
            username: userInDB.username,
            profilePic: userInDB.profilePic,
            location: userInDB.location,
            dateOfBirth: userInDB.dateOfBirth,
            joined: userInDB.createdAt,
            followers: userInDB.followers,
            following: userInDB.following,
          };
          res.status(200).json({
            result: { token: jwtToken, user: userInfo },
            message: "Logged In",
          });
        } else {
          return res.status(401).json({ message: "Invalid Credentials" });
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addUser,
  login,
};
