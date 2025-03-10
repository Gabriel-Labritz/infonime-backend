const Anime = require("../../models/Anime");
const deleteUploadFile = require("../../helpers/delete_file/delete_upload_file");
const errorsMessages = require("../../helpers/errors/errorsMessages");

async function checkAnimeExists(req, res, next) {
  let { title } = req.body;

  try {
    title = title.trim().toLowerCase();
    const animeExists = await Anime.findOne({ title });

    if (animeExists) {
      deleteUploadFile(req);
      return res.status(422).json({ message: errorsMessages.ANIME_EXISTS });
    }

    next();
  } catch (error) {
    console.error(error);
    deleteUploadFile(req);
    return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
  }
}

module.exports = checkAnimeExists;
