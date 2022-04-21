const router = require('express').Router();
const auth = require('../middlewares/auth');
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
router.get('/:id', auth, getUserId);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
