function buildAnimeUpdateData(req) {
  if (!req) {
    throw new Error("req is required!");
  }

  const {
    title,
    synopsis,
    episodes,
    seasons,
    category,
    release_date,
    distributor,
    audio,
    content_classification,
  } = req.body;

  const updateData = {};

  if (req.files?.anime_poster) {
    updateData.anime_poster = req.files.anime_poster[0].filename;
  }

  if (req.files?.anime_backdrop) {
    updateData.anime_backdrop = req.files.anime_backdrop[0].filename;
  }

  if (title) updateData.title = title.trim().toLowerCase();
  if (synopsis) updateData.synopsis = synopsis;
  if (episodes) updateData.episodes = parseInt(episodes);
  if (seasons) updateData.seasons = parseInt(seasons);
  if (category)
    updateData.category = Array.isArray(category) ? category : [category];
  if (release_date) updateData.release_date = release_date;
  if (distributor) updateData.distributor = distributor;
  if (audio) updateData.audio = audio;
  if (content_classification)
    updateData.content_classification = content_classification;

  return updateData;
}

module.exports = buildAnimeUpdateData;
