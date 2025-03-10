const bcrypt = require("bcrypt");

async function createHashPassword(password) {
  if (!password) {
    throw new Error("Password is required!");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
}

module.exports = createHashPassword;
