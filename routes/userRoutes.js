const express = require("express");
const UserController = require("../controllers/UserController");

// config router
const router = express.Router();

// middlewares
const validateUserRegister = require("../middlewares/UsersMiddlewares/validateUserRegister");
const validateUserLogin = require("../middlewares/UsersMiddlewares/validateUserLogin");
const validateUserUpdate = require("../middlewares/UsersMiddlewares/validateUserUpdate");
const checkUserExists = require("../middlewares/UsersMiddlewares/checkUserExists");
const verifyToken = require("../middlewares/tokens/verifyToken");
const validateId = require("../middlewares/AnimesMiddlewares/validateId");

// helpers
const { imageUpload } = require("../helpers/image_uploads/imageUploads");

// routes
router.post(
  "/register",
  validateUserRegister,
  checkUserExists,
  UserController.register
);
router.post("/login", validateUserLogin, UserController.login);
router.get("/myprofile", verifyToken, UserController.myUserProfile);
router.post(
  "/add-to-list/:id",
  verifyToken,
  validateId,
  UserController.addAnimeToList
);
router.post(
  "/remove-to-list/:id",
  verifyToken,
  validateId,
  UserController.removeAnimeToList
);
router.post("/rate/:id", verifyToken, validateId, UserController.rateAnime);
router.get("/:user_name", verifyToken, UserController.getUserByUserName);
router.patch(
  "/update",
  verifyToken,
  validateUserUpdate,
  checkUserExists,
  imageUpload.single("user_image"),
  UserController.update
);
router.delete("/delete", verifyToken, UserController.delete);

module.exports = router;
