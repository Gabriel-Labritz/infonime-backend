const path = require("path");
const fs = require("fs");

function deleteUploadedFiles(req) {
  if (req.files?.anime_poster) {
    const posterPath = path.join(
      __dirname,
      "../../public/images/animes",
      req.files.anime_poster[0].filename
    );
    fs.unlink(posterPath, (err) => {
      if (err) console.error("Erro ao excluir o pôster:", err);
    });
  }
  if (req.files?.anime_backdrop) {
    const backdropPath = path.join(
      __dirname,
      "../../public/images/animes",
      req.files.anime_backdrop[0].filename
    );
    fs.unlink(backdropPath, (err) => {
      if (err) console.error("Erro ao excluir o backdrop:", err);
    });
  }
}

module.exports = deleteUploadedFiles;
