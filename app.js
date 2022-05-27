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

const { PORT = 3000 } = process.env;

// const allowedCors = [
//   'https://mestoproject.nomoredomains.xyz',
//   'http://mestoproject.nomoredomains.xyz',
//   'http://localhost:3000'
// ];

// app.use(function(req, res, next) {
//   const { origin } = req.headers;

//   const { method } = req;

//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//   }

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }

//   next();
// });

app.use(cors({
  origin: [
    'https://mestoproject.nomoredomains.xyz',
    'http://mestoproject.nomoredomains.xyz',
    'http://localhost:3000',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', registerValid, createUser);

app.post('/signin', loginValid, login);

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   if (req.method === 'OPTIONS') {
//     res.send(200);
//   }
//   next();
// });

// const allowedCors = [
//   'https://mestoproject.nomoredomains.xyz',
//   'http://mestoproject.nomoredomains.xyz',
//   'http://localhost:3000'
// ];

// app.use(function(req, res, next) {
//   const { origin } = req.headers;

//   const { method } = req;

//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', '*');
//   }

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//   }

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }

//   next();
// });

app.use(auth);

app.use(error);

app.use(errors());

app.use(errHandler);

app.listen(PORT);
