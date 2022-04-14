const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const error = require('./routes/error');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '62566ec72108696bd4b4caa3', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use(error);
app.listen(PORT);
