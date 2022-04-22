const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  userAvatarValid,
  parameterIdValid,
  userValid,
} = require('../middlewares/validation');
const
  {
    getUser,
    getUserId,
    updateUser,
    updateUserAvatar,
    userInfo,
  } = require('../controllers/users');

router.get('/', auth, getUser);
router.get('/me', auth, userInfo);
router.get('/:id', auth, parameterIdValid('id'), getUserId);
router.patch('/me', auth, userValid, updateUser);
router.patch('/me/avatar', auth, userAvatarValid, updateUserAvatar);

module.exports = router;
