const express = require('express');
const apiRouter = require('./routes/api');
const {
  handle405,
  handle404,
  handle400,
  handle422,
  methodNotAllowed
} = require('./errors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', methodNotAllowed);

app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use((err, req, res, next) => {
  res.status(500).json({
    msg: 'Server error'
  });
});

module.exports = app;
