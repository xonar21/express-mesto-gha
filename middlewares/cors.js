// const express = require('express');

// const app = express();

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