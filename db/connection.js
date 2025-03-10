const mongoose = require("mongoose");
require("dotenv").config();

// connection with database
async function connection() {
  await mongoose.connect(process.env.APP_DATABASE_URL);
  console.log("Conectado ao MongoDb com mongoose!");
}

connection();

module.exports = mongoose;
