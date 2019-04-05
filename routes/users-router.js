const usersRouter = require('express').Router();

const {
  getAllUsers,
  getUserByUsername
} = require('../controllers/users-controller');
const { methodNotAllowed, handle405 } = require('../errors');

usersRouter
  .route('/')
  .get(getAllUsers)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(handle405);

module.exports = usersRouter;
