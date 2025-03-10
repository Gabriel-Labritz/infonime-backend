const path = require("path");
const fs = require("fs");

function deleteOldAnimeImages(anime, req) {
  if (req.files?.anime_poster) {
    const posterPath = path.join(
      __dirname,
      "../../public/images/animes",
      anime.anime_poster
    );

    if (fs.existsSync(posterPath)) {
      fs.unlinkSync(posterPath, (err) => {
        if (err)
          console.error("Erro ao excluir a imagem do poster anterior :", err);
      });
    }
  }

  if (req.files?.anime_backdrop) {
    const backdropPath = path.join(
      __dirname,
      "../../public/images/animes",
      anime.anime_backdrop
    );

    if (fs.existsSync(backdropPath)) {
      fs.unlinkSync(backdropPath, (err) => {
        if (err)
          console.error("Erro ao excluir a imagem backdrop anterior: ", err);
      });
    }
  }
}

module.exports = deleteOldAnimeImages;
