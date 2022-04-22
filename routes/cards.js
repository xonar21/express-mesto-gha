const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  createCardValid,
  parameterIdValid,
} = require('../middlewares/validation');

const
  {
    createCard,
    getCard,
    deleteCard,
    setCardLikes,
    deleteCardLikes,
  } = require('../controllers/cards');

router.post('/', auth, createCardValid, createCard);
router.get('/', auth, getCard);
router.delete('/:cardid', parameterIdValid('cardid'), auth, deleteCard);
router.put('/:cardid/likes', auth, parameterIdValid('cardid'), setCardLikes);
router.delete('/:cardid/likes', auth, parameterIdValid('cardid'), deleteCardLikes);

module.exports = router;
