const User = require('../models/user');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorValidation = require('../errors/errorValidation');
const ErrorDefault = require('../errors/errorDefault');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};
module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound('Пользователь не найден');
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {

      if (err.name === 'CastError') {
        res.status(400).send({message: 'Пользователь по указанному _id не найден.'});
      } else if (err.statusCode === 404) {
        res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
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
        res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'});
      } else if (err.name === 'CastError') {
        res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
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
        res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'});
      } else if (err.name === 'CastError') {
        res.status(404).send({message: 'Пользователь по указанному _id не найден.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
      }
    });
};
