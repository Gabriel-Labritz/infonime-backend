const validator = require("validator");
const validatePassword = require("../../helpers/password/validadePassword");
const errorsMessages = require("../../helpers/errors/errorsMessages");

function validateUserRegister(req, res, next) {
  const { user_name, email, password } = req.body;

  if (!user_name) {
    return res.status(422).json({ message: errorsMessages.USER_NAME_EMPTY });
  }

  if (!email) {
    return res.status(422).json({ message: errorsMessages.USER_EMAIL_EMPTY });
  } else if (email && !validator.isEmail(email)) {
    return res.status(422).json({ message: errorsMessages.USER_EMAIL_INVALID });
  }

  if (!password) {
    return res
      .status(422)
      .json({ message: errorsMessages.USER_PASSWORD_EMPTY });
  } else if (password && !validatePassword(password)) {
    return res.status(422).json({
      message: errorsMessages.USER_PASSWORD_INVALID,
    });
  }

  next();
}

module.exports = validateUserRegister;
