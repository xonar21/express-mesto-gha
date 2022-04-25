const Card = require('../models/card');

const ErrorDefault = require('../errors/errorDefault');

const ErrorNotFound = require('../errors/errorNotFound');

const ErrorBadRequest = require('../errors/errorBadRequest');

const Forbidden = require('../errors/Forbidden');

// module.exports.deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardid)
//     .orFail(() => {
//       res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
//     })
//     .then((cards) => res.status(200).send(cards))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send(new ErrorBadRequest('Карточка с указанным _id не найдена.'));
//       } else {
//         res.status(500).send(new ErrorDefault('Ошибка по умолчанию.'));
//       }
//     });
// };

// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardid)
//     .orFail(() => {
//       throw new ErrorNotFound('Карточка не найдена');
//     })
//     .then((card) => {
//       if (!card) {
//         next(new ErrorNotFound('Карточка не найдена'));
//       }
//       res.status(200).send({ data: card, message: 'Карточка удалена' });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ErrorBadRequest({ message: 'Переданы некорректные данные' }));
//       }
//       next(err);
//     });
// };

module.exports.deleteCard = (req, res, next) => {
  const { cardid } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardid })
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id ${cardid} не найдена!`);
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new Forbidden('Отказано в удалении. Пользователь не является владельцом карточки');
      }
      return Card.findByIdAndRemove(card._id);
    })
    .then((card) => res.send({ message: 'Успешно удалена карточка:', data: card }))
    .catch(next);
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
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
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
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
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
