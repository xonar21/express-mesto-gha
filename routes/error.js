const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

router.use('/users', users);
router.use('/cards', cards);

router.use((req, res) => {
  res.status(404).send({ message: 'Данный путь не найден' });
});

module.exports = router;
