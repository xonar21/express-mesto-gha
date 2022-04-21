const Card = require('../models/card');

const ErrorNotFound = require('../errors/errorNotFound');

const ErrorDefault = require('../errors/errorDefault');

const ErrorBadRequest = require('../errors/errorBadRequest');

module.exports.deleteCard = (req, res) => {
  console.log(req)
  Card.findByIdAndRemove(req.params.cardid)
    .orFail(() => {
      res.status(404).send(new ErrorNotFound('Передан несуществующий _id карточки.'));
    })
    .then((cards) => res.status(200).send(console.log(cards.owner.newObjectId)))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(new ErrorBadRequest('Карточка с указанным _id не найдена.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(new ErrorBadRequest('Переданы некорректные данные при создании карточки.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};

module.exports.setCardLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(404).send(new ErrorNotFound('Передан несуществующий _id карточки.'));
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(new ErrorBadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'CastError') {
        res.status(400).send(new ErrorBadRequest('Передан несуществующий _id карточки.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};

module.exports.deleteCardLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(404).send(new ErrorNotFound('Передан несуществующий _id карточки.'));
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(new ErrorBadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'CastError') {
        res.status(400).send(new ErrorBadRequest('Передан несуществующий _id карточки.'));
      } else {
        res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
      }
    });
};
