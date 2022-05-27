require('dotenv').config();

const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const error = require('./routes/error');

const auth = require('./middlewares/auth');

const cors = require('cors');

const errHandler = require('./middlewares/errHandler');

const { registerValid, loginValid } = require('./middlewares/validation');

const { login, createUser } = require('./controllers/users');

const app = express();

const { PORT = 4000 } = process.env;

app.use(cors({
  origin: [
    'https://mestoproject.nomoredomains.xyz',
    'http://mestoproject.nomoredomains.xyz',
    'http://localhost:4000',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', registerValid, createUser);

app.post('/signin', loginValid, login);

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use(auth);

app.use(error);

app.use(errors());

app.use(errHandler);

app.listen(PORT);
