const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Anime = require("../models/Anime");

// Helpers
const createHashPassword = require("../helpers/password/createHashPassword");
const createUserToken = require("../helpers/tokens/createUserToken");
const checkPasswordMatch = require("../helpers/password/checkPasswordMatch");
const getToken = require("../helpers/tokens/getToken");
const getUserByToken = require("../helpers/tokens/getUserByToken");
const successMessages = require("../helpers/success/successMessages");
const errorsMessages = require("../helpers/errors/errorsMessages");

module.exports = class UserController {
  static async register(req, res) {
    const { user_name, email, password } = req.body;

    try {
      const passwordHash = await createHashPassword(password);

      const user = new User({
        user_name,
        email,
        password: passwordHash,
      });

      await user.save();
      const token = createUserToken(user);

      return res
        .status(201)
        .json({ message: successMessages.USER_SUCCESS_REGISTER, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: errorsMessages.SERVER_ERROR,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: errorsMessages.USER_NOT_FOUND });
      }

      const passwordMatch = await checkPasswordMatch(password, user);

      if (!passwordMatch) {
        return res.status(422).json({
          message: errorsMessages.USER_PASSWORD_WRONG,
        });
      }

      const token = createUserToken(user);

      return res
        .status(200)
        .json({ message: successMessages.USER_SUCCESS_LOGIN, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async myUserProfile(req, res) {
    try {
      const { _id: userId } = req.user;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: errorsMessages.USER_NOT_FOUND });
      }

      return res.status(200).json({
        user: {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
          // user_image: user.user_image,
          // animeList: user.animeList,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async getUserByUserName(req, res) {
    const { user_name } = req.params;

    try {
      const user = await User.findOne({ user_name }).select([
        "user_name",
        "user_image",
        "animeList",
        "createdAt",
      ]);

      if (!user) {
        return res.status(404).json({ message: errorsMessages.USER_NOT_FOUND });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async update(req, res) {
    const { user_name, email, password } = req.body;
    const updateData = {};

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (req.file) updateData.user_image = req.file.filename;
    if (user_name) updateData.user_name = user_name;
    if (email) updateData.email = email;

    if (password) {
      const hashPassword = await createHashPassword(password);
      updateData.password = hashPassword;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: updateData },
        { new: true }
      );

      return res.status(200).json({
        message: successMessages.USER_SUCCESS_UPDATE,
        user: {
          id: updatedUser._id,
          user_name: updatedUser.user_name,
          email: updatedUser.email,
          user_image: updatedUser.user_image,
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(422).json({
          message: "Já existe um usuário com este nome de usuário ou email.",
        });
      }
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async delete(req, res) {
    try {
      const token = getToken(req);
      const user = await getUserByToken(token, res);

      if (!user) {
        return res.status(404).json({ message: errorsMessages.USER_NOT_FOUND });
      }

      if (user.user_image) {
        const imgPath = path.join(
          __dirname,
          "../public/images/users",
          user.user_image
        );

        fs.unlink(imgPath, (err) => {
          if (err) {
            console.error("Erro ao deletar a imagem de usuário !", err);
            return;
          }
        });
      }

      const deletedUser = await User.findByIdAndDelete(user._id);

      if (!deletedUser) {
        return res
          .status(404)
          .json({ message: errorsMessages.FAILED_DELETE_USER });
      }

      return res
        .status(200)
        .json({ message: successMessages.USER_SUCCESS_DELETE });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async addAnimeToList(req, res) {
    const { id } = req.params; // animeId
    const { _id: userId } = req.user; // userId

    try {
      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      const user = await User.findById(userId);

      const alreadyInList = user.animeList.some(
        (item) => item.anime.toString() === id
      );

      if (alreadyInList) {
        return res
          .status(422)
          .json({ message: errorsMessages.ANIME_ALREADY_IN_LIST });
      }

      user.animeList.push({ anime: id });
      await user.save();

      return res.status(200).json({
        message: successMessages.ANIME_ADD_IN_LIST_SUCCESS,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async removeAnimeToList(req, res) {
    const { id } = req.params; // animeId
    const { _id: userId } = req.user; // userId

    try {
      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      const user = await User.findById(userId).select([
        "_id",
        "user_name",
        "animeList",
      ]);

      const animeOnList = user.animeList.some(
        (item) => item.anime.toString() === id
      );

      if (!animeOnList) {
        return res.status(422).json({
          message: errorsMessages.ANIME_INST_IN_LIST,
        });
      }

      // remove anime from user animeList
      user.animeList = user.animeList.filter(
        (item) => item.anime.toString() !== id
      );

      await user.save();

      return res.status(200).json({
        message: `${anime.title} ${successMessages.ANIME_REMOVE_FROM_LIST_SUCCESS}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async rateAnime(req, res) {
    const { id } = req.params; // animeId
    const { _id: userId } = req.user; // userId
    const { rating } = req.body;

    try {
      if (rating < 0 || rating > 10) {
        return res
          .status(422)
          .json({ message: "A nota deve ser entre 0 e 10" });
      }

      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      const existingRating = anime.ratings.find(
        (item) => item.user.toString() === userId.toString()
      );

      if (existingRating) {
        existingRating.rating = rating;
      } else {
        anime.ratings.push({ user: userId, rating });
        anime.ratingCount += 1;
      }

      const totalRating = anime.ratings.reduce(
        (sum, item) => sum + item.rating,
        0
      );

      if (anime.ratingCount > 0) {
        anime.rating = (totalRating / anime.ratingCount).toFixed(1);
      } else {
        anime.rating = 0;
      }

      await anime.save();

      return res.status(200).json({
        message: "Avaliação registrada com sucesso!",
        anime: {
          _id: anime._id,
          title: anime.title,
          rating: anime.rating,
          ratingCount: anime.ratingCount,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async myList(req, res) {
    const { _id: userId } = req.user;

    try {
      const user = await User.findById(userId).populate({
        path: "animeList.anime",
        select: "title anime_backdrop seasons episodes",
      });

      return res.status(200).json({ animeList: user.animeList });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }
};
