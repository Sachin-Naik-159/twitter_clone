const express = require("express");
const { upload, downloadFile } = require("../controllers/file_controller");

const router = express.Router();

router.post("/uploadFile", upload.single("file"), function (req, res) {
  res.json({ fileName: req.file.filename });
});
router.get("/:filename", downloadFile);

module.exports = router;
