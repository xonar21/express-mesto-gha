const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ErrorNotFound = require('../errors/errorNotFound');

const ErrorDefault = require('../errors/errorDefault');

const ErrorBadRequest = require('../errors/errorBadRequest');

const ErrorConflict = require('../errors/errorConflict');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      const token = jwt.sign({ _id: matched._id }, 'some-secret-key', { expiresIn: '7d' });
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => next(res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'))));
};
module.exports.userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.status(200).send(users))
    .catch(() => next(res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'))));
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
        res.status(409).send(new ErrorConflict({ message: `Пользователь с таким email ${email} уже зарегистрирован` }));
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
