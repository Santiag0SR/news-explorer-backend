const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

const { apiLimiter } = require('./utils/rateLimit');
const { MONGO_SERVER } = require('./utils/apploication_constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(MONGO_SERVER, { useNewUrlParser: true });

app.use(helmet());
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // the request logger

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62a74d5575478a48ed9c0054',
//   };

//   next();
// });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

app.use(cors());
app.options('*', cors()); // enable requests for all routes

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(router);

app.use(errorLogger); // the error logger

app.use(errors()); // celebrate error handler

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
}); // Centralised error handler

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
