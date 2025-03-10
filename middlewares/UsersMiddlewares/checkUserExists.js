const User = require("../../models/User");
const errorsMessages = require("../../helpers/errors/errorsMessages");

async function checkUserExists(req, res, next) {
  const { user_name, email } = req.body;

  try {
    const userNameExists = await User.findOne({ user_name });

    if (userNameExists) {
      return res
        .status(422)
        .json({ message: errorsMessages.USER_NAME_ALREADY_EXISTS });
    }

    const userEmailExists = await User.findOne({ email });

    if (userEmailExists) {
      return res
        .status(422)
        .json({ message: errorsMessages.USER_EMAIL_ALREADY_EXISTS });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: errorsMessages.SERVER_ERROR });
  }
}

module.exports = checkUserExists;
