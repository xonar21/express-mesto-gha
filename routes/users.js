const router = require('express').Router();

const
  {
    userInfo,
    getUser,
    getUserId,
    updateUser,
    updateUserAvatar,
  } = require('../controllers/users');

router.get('/me', userInfo);
router.get('/', getUser);
router.get('/:id', getUserId);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
