const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  //const token = String(req.headers.authorization).replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
