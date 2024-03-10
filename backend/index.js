const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("./models/dbconnect");

global.__basedir = __dirname;

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors()); //Enabling Cross-origin sharing
app.use(express.json()); //Enabling Cross-origin sharing

app.use("/api/v1/auth", require("./routes/auth_routers"));
app.use("/api/v1/user", require("./routes/user_update_routers"));
app.use("/api/v1/tweet", require("./routes/tweet_routers"));
app.use("/api/v1/file", require("./routes/file_routers"));

app.listen(PORT, () => {
  console.log("Started on: " + PORT);
});
