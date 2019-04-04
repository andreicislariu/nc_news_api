const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleWithVotes,
  deleteArticleByArticle_id
} = require('../controllers/articles-controller');
const {
  getCommentsByArticle_id,
  postCommentByArticle_id
} = require('../controllers/comments-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleWithVotes)
  .delete(deleteArticleByArticle_id)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle_id)
  .post(postCommentByArticle_id)
  .all(methodNotAllowed);

module.exports = articlesRouter;
