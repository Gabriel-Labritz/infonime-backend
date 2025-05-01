const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");

// port
const PORT = process.env.PORT || process.env.APP_PORT || 5000;

// routes
const userRoutes = require("./routes/userRoutes");
const animeRoutes = require("./routes/animeRoutes");

// config app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// use routes app
app.use("/users", userRoutes);
app.use("/animes", animeRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
