const mongoose = require("../db/connection");
const { Schema } = mongoose;

// create an user schema

const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
    },
    animeList: [
      {
        anime: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Anime",
        },
        rating: {
          type: Number,
          min: 0,
          max: 10,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
