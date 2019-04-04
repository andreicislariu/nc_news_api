const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controller');
const { methodNotAllowed, handle405 } = require('../errors');

topicsRouter
  .route('/')
  .get(getAllTopics)
  .all(handle405);

module.exports = topicsRouter;
