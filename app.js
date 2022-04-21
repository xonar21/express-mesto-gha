const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const error = require('./routes/error');

const auth = require('./middlewares/auth');

const { registerValid, loginValid } = require('./middlewares/validation');

const {login, createUser} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);
app.use((req, res, next) => {
  req.user = {
    _id: '625d6acbfe5293fc7a8221441'
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));


app.use(auth);

app.use(error);
app.listen(PORT);
