const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/authentication-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authorization is still Required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (err) {
    return next(new AuthenticationError('Authorization is still Required'));
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};
