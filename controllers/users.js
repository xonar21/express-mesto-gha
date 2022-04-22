const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ErrorNotFound = require('../errors/errorNotFound');

const ErrorDefault = require('../errors/errorDefault');

const ErrorBadRequest = require('../errors/errorBadRequest');

const ErrorConflict = require('../errors/errorConflict');

const Unauthorized = require('../errors/Unauthorized');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(res, email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Авторизация успешна', token });
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new Unauthorized('Не правильный логин или пароль'));
      }
      next(err);
    });
};
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => next(res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'))));
};
module.exports.userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound('Пользователь не найден');
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(new ErrorBadRequest('Пользователь по указанному _id не найден.'));
      } else if (err.statusCode === 404) {
        res.status(404).send(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: `Пользователь с таким email ${email} уже зарегистрирован` });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id })) // прячет пароль
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ErrorConflict({ message: err.errorMessage }));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(new ErrorBadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'CastError') {
        res.status(404).send(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(new ErrorBadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.name === 'CastError') {
        res.status(404).send(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};
