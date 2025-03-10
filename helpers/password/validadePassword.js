function validatePassword(password) {
  password.trim();
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;

  if (!regex.test(password)) {
    return false;
  }

  return true;
}

module.exports = validatePassword;
