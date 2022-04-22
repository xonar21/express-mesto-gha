const router = require('express').Router();

const auth = require('../middlewares/auth');

const
  {
    createCard,
    getCard,
    deleteCard,
    setCardLikes,
    deleteCardLikes,
  } = require('../controllers/cards');

router.post('/', auth, createCard);
router.get('/', auth, getCard);
router.delete('/:cardid', auth, deleteCard);
router.put('/:cardid/likes', auth, setCardLikes);
router.delete('/:cardid/likes', auth, deleteCardLikes);

module.exports = router;
