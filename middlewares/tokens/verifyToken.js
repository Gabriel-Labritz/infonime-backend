const jwt = require("jsonwebtoken");
const getToken = require("../../helpers/tokens/getToken");
const errorsMessages = require("../../helpers/errors/errorsMessages");
const User = require("../../models/User");
require("dotenv").config();

async function verifyToken(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: errorsMessages.ACCESS_DENIED });
  }

  try {
    const userVerifed = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });

    const { id } = userVerifed;

    const user = await User.findById(id).select([
      "-password",
      "-email",
      "-updatedAt",
    ]);

    if (!user) {
      return res.status(404).json({ message: errorsMessages.USER_NOT_FOUND });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: errorsMessages.INVALID_TOKEN });
    }

    return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
  }
}

module.exports = verifyToken;
