const deleteUploadedFiles = require("../../helpers/delete_file/delete_upload_file");
const errorsMessages = require("../../helpers/errors/errorsMessages");

function validateAnimeRegister(req, res, next) {
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

  if (!title) {
    deleteUploadedFiles(req);
    return res.status(422).json({ message: errorsMessages.ANIME_TITLE_EMPTY });
  }

  if (!synopsis) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_SYNOPSIS_EMPTY });
  }

  if (!episodes || isNaN(episodes) || episodes <= 0) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_EPISODES_INVALID });
  }

  if (!seasons || isNaN(seasons) || seasons <= 0) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_SEASONS_INVALID });
  }

  if (!release_date || isNaN(release_date)) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_RELEASE_DATE_INVALID });
  }

  if (!distributor) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_DISTRIBUTOR_EMPTY });
  }

  if (!audio) {
    deleteUploadedFiles(req);
    return res.status(422).json({ message: errorsMessages.ANIME_AUDIO_EMPTY });
  }

  if (!content_classification) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_CONTENT_CLASSIFICATION_EMPTY });
  }

  if (!category) {
    deleteUploadedFiles(req);
    return res
      .status(422)
      .json({ message: errorsMessages.ANIME_CATEGORY_EMPTY });
  }

  next();
}

module.exports = validateAnimeRegister;
