const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardid)
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Карточка с указанным _id не найдена.'});
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
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
      }
    });
};

module.exports.setCardLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'});
      } else if (err.name === 'CastError') {
        res.status(404).send({message: 'Передан несуществующий _id карточки.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
      }
    });
};

module.exports.deleteCardLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'});
      } else if (err.name === 'CastError') {
        res.status(404).send({message: 'Передан несуществующий _id карточки.'});
      } else {
        res.status(500).send({message: 'Ошибка по умолчанию.'});
      }
    });
};
