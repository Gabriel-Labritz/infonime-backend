const validator = require("validator");
const validatePassword = require("../../helpers/password/validadePassword");
const errorsMessages = require("../../helpers/errors/errorsMessages");

function validateUserUpdate(req, res, next) {
  const { user_name, email, password } = req.body;

  if (user_name != null && user_name.trim() === "") {
    return res.status(422).json({ message: errorsMessages.USER_NAME_EMPTY });
  }

  if (email != null && !validator.isEmail(email)) {
    return res.status(422).json({ message: errorsMessages.USER_EMAIL_INVALID });
  }

  if (password != null && !validatePassword(password)) {
    return res
      .status(422)
      .json({ message: errorsMessages.USER_PASSWORD_INVALID });
  }

  next();
}

module.exports = validateUserUpdate;
