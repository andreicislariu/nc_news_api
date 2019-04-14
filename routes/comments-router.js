const commentsRouter = require('express').Router();
const { handle405 } = require('../errors');
const {
  getCommentsByArticle_id,
  patchCommentWithVotes,
  deleteCommentByArticle_id
} = require('../controllers/comments-controller');

commentsRouter
  .route('/:comment_id')
  .get(getCommentsByArticle_id)
  .patch(patchCommentWithVotes)
  .delete(deleteCommentByArticle_id)
  .all(handle405);

module.exports = commentsRouter;
