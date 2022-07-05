const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    country: user.country,
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = generateToken;