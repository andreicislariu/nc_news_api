const articlesRouter = require('express').Router();
const { handle405 } = require('../errors');
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

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleWithVotes)
  .delete(deleteArticleByArticle_id)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle_id)
  .post(postCommentByArticle_id)
  .all(handle405);

module.exports = articlesRouter;
