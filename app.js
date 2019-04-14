const express = require('express');
const apiRouter = require('./routes/api');
const { handle400, handle404, handle405, handle422 } = require('./errors');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handle405);

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
