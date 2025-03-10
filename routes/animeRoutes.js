const express = require("express");
const AnimeController = require("../controllers/AnimeController");

const router = express.Router();

// midlewares
const validateAnimeRegister = require("../middlewares/AnimesMiddlewares/validateAnimeRegister");
const checkAnimeExists = require("../middlewares/AnimesMiddlewares/checkAnimeExists");
const verifyToken = require("../middlewares/tokens/verifyToken");
const validateId = require("../middlewares/AnimesMiddlewares/validateId");

// helpers
const { imageUpload } = require("../helpers/image_uploads/imageUploads");

// routes
router.post(
  "/register",
  verifyToken,
  imageUpload.fields([
    { name: "anime_poster", maxCount: 1 },
    { name: "anime_backdrop", maxCount: 1 },
  ]),
  validateAnimeRegister,
  checkAnimeExists,
  AnimeController.animeRegister
);
router.get("/all", verifyToken, AnimeController.getAllAnimes);
router.get("/search/:title", verifyToken, AnimeController.getAnimeByTitle);
router.get("/:id", verifyToken, validateId, AnimeController.getAnimeById);
router.patch(
  "/update/:id",
  verifyToken,
  imageUpload.fields([
    { name: "anime_poster", maxCount: 1 },
    { name: "anime_backdrop", maxCount: 1 },
  ]),
  validateId,
  AnimeController.updateAnime
);
router.delete(
  "/delete/:id",
  verifyToken,
  validateId,
  AnimeController.deleteAnime
);

module.exports = router;
