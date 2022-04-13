const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;


module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send('Пользователь по указанному _id не найден.');
        res.status(ERROR_CODE).send(err);
      } else {
        next(err);
      }
    });
};
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(ERROR_CODE).send('Переданы некорректные данные при создании пользователя.');
        res.status(ERROR_CODE).send(err);
        console.log(err.message)
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
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
        res.status(ERROR_CODE).send('Переданы некорректные данные при создании пользователя.');
      } else if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send('Пользователь по указанному _id не найден.');
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
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
        res.status(ERROR_CODE).send('Переданы некорректные данные при создании пользователя.');
      } else if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send('Пользователь по указанному _id не найден.');
      } else {
        next(err);
      }
    });
};
