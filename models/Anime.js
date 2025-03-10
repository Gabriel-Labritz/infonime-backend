const mongoose = require("../db/connection");
const { Schema } = mongoose;

const AnimeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    episodes: {
      type: Number,
      required: true,
    },
    seasons: {
      type: Number,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    release_date: {
      type: Number,
      required: true,
    },
    anime_poster: {
      type: String,
      required: true,
    },
    anime_backdrop: {
      type: String,
      required: true,
    },
    distributor: {
      type: String,
    },
    audio: {
      type: String,
      required: true,
    },
    content_classification: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0, // Número total de avaliações
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Referência ao modelo User
        },
        rating: {
          type: Number,
          min: 0,
          max: 10,
        },
      },
    ],
  },
  { timestamps: true }
);

AnimeSchema.pre("save", function (next) {
  this.title = this.title.trim().toLowerCase();
  next();
});

const Anime = mongoose.model("Anime", AnimeSchema);

module.exports = Anime;
