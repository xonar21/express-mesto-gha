const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const error = require('./routes/error');

const auth = require('./middlewares/auth');

const errHandler = require('./middlewares/errHandler');

const { registerValid, loginValid } = require('./middlewares/validation');

const { login, createUser } = require('./controllers/users');

const { requestLogger, errorLoger } = require('./middlewares/loger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   req.user = {
//     _id: '625d646436400a2342e084d6'
//   };

//   next();
// });
app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use(errorLoger);

app.use(auth);

app.use(error);

app.use(errors());

app.use(errHandler);

app.listen(PORT);
