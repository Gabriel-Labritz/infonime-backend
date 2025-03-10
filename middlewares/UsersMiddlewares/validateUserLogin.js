const validator = require("validator");
const errorsMessages = require("../../helpers/errors/errorsMessages");

function validateUserLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ message: errorsMessages.USER_EMAIL_EMPTY });
  } else if (email && !validator.isEmail(email)) {
    return res.status(422).json({ message: errorsMessages.USER_EMAIL_INVALID });
  }

  if (!password) {
    return res
      .status(422)
      .json({ message: errorsMessages.USER_PASSWORD_EMPTY });
  }

  next();
}

module.exports = validateUserLogin;
