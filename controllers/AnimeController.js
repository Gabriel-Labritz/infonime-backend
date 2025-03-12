const path = require("path");
const fs = require("fs");
const Anime = require("../models/Anime");
const errorsMessages = require("../helpers/errors/errorsMessages");
const successMessages = require("../helpers/success/successMessages");
const deleteOldAnimeImages = require("../helpers/delete_file/delete_old_anime_images");
const buildAnimeUpdateData = require("../helpers/build_object_data/buildAnimeUpdateData");

module.exports = class AnimeController {
  static async animeRegister(req, res) {
    const {
      title,
      synopsis,
      episodes,
      seasons,
      release_date,
      distributor,
      audio,
      content_classification,
      category,
    } = req.body;

    try {
      const anime_poster = req.files?.anime_poster?.[0]?.filename || null;
      const anime_backdrop = req.files?.anime_backdrop?.[0].filename || null;

      if (!anime_poster) {
        return res
          .status(422)
          .json({ message: errorsMessages.ANIME_POSTER_EMPTY });
      }

      if (!anime_backdrop) {
        return res
          .status(422)
          .json({ message: errorsMessages.ANIME_BACKDROP_EMPTY });
      }

      const anime = new Anime({
        title,
        synopsis,
        episodes: parseInt(episodes),
        seasons: parseInt(seasons),
        release_date,
        distributor,
        audio,
        content_classification,
        anime_poster,
        anime_backdrop,
        category: Array.isArray(category) ? category : [category],
      });

      await anime.save();

      return res
        .status(200)
        .json({ message: successMessages.ANIME_SUCCESS_REGISTER, anime });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async getAnimeById(req, res) {
    const { id } = req.params;

    try {
      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      return res.status(200).json({ anime });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async getAllAnimes(req, res) {
    try {
      const animes = await Anime.find();

      if (!animes) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIMES_INST_AVALIABLE });
      }

      return res.status(200).json({ animes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async updateAnime(req, res) {
    const { id } = req.params;

    try {
      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      deleteOldAnimeImages(anime, req);

      const updateData = buildAnimeUpdateData(req);

      const updatedAnime = await Anime.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: successMessages.ANIME_SUCCESS_UPDATE, updatedAnime });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async deleteAnime(req, res) {
    const { id } = req.params;

    try {
      const anime = await Anime.findById(id);

      if (!anime) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      const posterPath = path.join(
        __dirname,
        "../public/images/animes",
        anime.anime_poster
      );

      const backdropPath = path.join(
        __dirname,
        "../public/images/animes",
        anime.anime_backdrop
      );

      fs.unlink(posterPath, (err) => {
        if (err) console.error("Erro ao excluir o poster do anime!", err);
      });

      fs.unlink(backdropPath, (err) => {
        if (err) console.error("Erro ao excluir o backdrop do anime!", err);
      });

      await Anime.findByIdAndDelete(id);

      return res
        .status(200)
        .json({ mesage: successMessages.ANIME_SUCCESS_DELETE });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async getAnimeByTitle(req, res) {
    const { title } = req.params;

    try {
      const animes = await Anime.find({
        title: { $regex: title, $options: "i" },
      });

      if (!animes || animes.length === 0) {
        return res
          .status(404)
          .json({ message: errorsMessages.ANIME_NOT_FOUND });
      }

      return res.status(200).json({ animes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }
  }

  static async getAnimesByCategory(req, res) {
    const { category } = req.params;

    try {
      const animes = await Anime.find({
        category: { $regex: new RegExp(category, "i") },
      });

      if (!animes || animes.length === 0) {
        return res
          .status(404)
          .json({ message: errorsMessages.CATEGORY_ANIME_NOT_FOUND });
      }

      return res.status(200).json({ animes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
    }

    return res.status(200).json({ message: "Rota de category ok!" });
  }
};
