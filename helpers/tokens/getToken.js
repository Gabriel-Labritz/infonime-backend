function getToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token && token !== null) {
      return token;
    }
  }

  return null;
}

module.exports = getToken;
