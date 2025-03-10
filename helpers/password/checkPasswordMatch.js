const bcrypt = require("bcrypt");

async function checkPasswordMatch(password, user) {
  if (!password) {
    throw new Error("Password is required!");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  return checkPassword;
}

module.exports = checkPasswordMatch;
