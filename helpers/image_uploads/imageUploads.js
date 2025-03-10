const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("animes")) {
      folder = "animes";
    }

    cb(null, `public/images/${folder}`);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        String(Math.floor(Math.random() * 1000)) +
        path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpe|jpeg)$/)) {
      return cb(
        new Error("Erro, envie somente images com a extensão .png ou jpg")
      );
    }
    cb(undefined, true);
  },
  preservePath: true,
});

module.exports = { imageUpload };
