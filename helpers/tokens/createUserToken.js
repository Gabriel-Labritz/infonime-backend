const jwt = require("jsonwebtoken");
require("dotenv").config();

function createUserToken(user) {
  const token = jwt.sign(
    {
      id: user._id,
      user_name: user.user_name,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS256" }
  );

  return token;
}

module.exports = createUserToken;
