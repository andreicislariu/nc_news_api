const topicsRouter = require('express').Router();
const { handle405 } = require('../errors');
const { getAllTopics } = require('../controllers/topics-controller');

topicsRouter
  .route('/')
  .get(getAllTopics)
  .all(handle405);

module.exports = topicsRouter;
