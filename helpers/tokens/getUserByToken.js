const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require("dotenv").config();

async function getUserByToken(token, res) {
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido!" });
  }

  const decoded = jwt.decode(token, process.env.SECRET_KEY);
  const userId = decoded.id;

  const user = await User.findById(userId).select("-password");
  return user;
}

module.exports = getUserByToken;
