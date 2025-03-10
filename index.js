const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// routes
const userRoutes = require("./routes/userRoutes");
const animeRoutes = require("./routes/animeRoutes");

// config app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// use routes app
app.use("/users", userRoutes);
app.use("/animes", animeRoutes);

app.listen(process.env.APP_PORT);
