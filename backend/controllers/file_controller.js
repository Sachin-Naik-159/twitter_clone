const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return res
        .status(400)
        .json({ error: "File types allowed are .jpeg, .png, .jpg" });
    }
  },
});

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const path = __basedir + "/uploads/";

  res.download(path + fileName, (error) => {
    if (error) {
      res.status(500).send({ meassge: "File cannot be downloaded " + error });
    }
  });
};

module.exports = {
  upload,
  downloadFile,
};
