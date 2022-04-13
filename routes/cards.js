const router = require('express').Router();
const
  {
    createCard,
    getCard,
    deleteCard,
    setCardLikes,
    deleteCardLikes,
  } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCard);
router.delete('/:cardid', deleteCard);
router.put('/:cardid/likes', setCardLikes);
router.delete('/:cardid/likes', deleteCardLikes);

module.exports = router;
