const ObjectId = require("mongoose").Types.ObjectId;
const errorsMessages = require("../../helpers/errors/errorsMessages");

function validateId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(422).json({ message: errorsMessages.ID_EMPTY });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(422).json({ message: errorsMessages.ID_INVALID });
  }

  next();
}

module.exports = validateId;
