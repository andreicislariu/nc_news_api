const usersRouter = require('express').Router();
const { handle405 } = require('../errors');
const { getAllUsers, getUser } = require('../controllers/users-controller');

usersRouter
  .route('/')
  .get(getAllUsers)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(getUser)
  .all(handle405);

module.exports = usersRouter;
