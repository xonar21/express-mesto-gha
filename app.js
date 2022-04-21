const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const error = require('./routes/error');

const auth = require('./middlewares/auth');

const { registerValid, loginValid } = require('./middlewares/validation');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use('/users',auth, require('./routes/users'));

app.use('/cards',auth, require('./routes/cards'));

app.use(auth);

app.use(errors());

app.use(error);
app.listen(PORT);
