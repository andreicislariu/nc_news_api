const {
  fetchAllArticles,
  fetchArticleById,
  patchArticle,
  deleteArticle
} = require('../models/articles-models');

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params['article_id'])
    .then(([article]) => {
      if (article === undefined) next({ status: 404 });
      else return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleWithVotes = (req, res, next) => {
  if (
    typeof req.body.inc_votes !== 'number' &&
    req.body.inc_votes !== undefined
  )
    next({
      status: 422
    });
  else {
    patchArticle(req.params['article_id'], req.body['inc_votes'])
      .then(([article]) => {
        if (article === undefined) next({ status: 404 });
        return res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.deleteArticleByArticle_id = (req, res, next) => {
  deleteArticle(req.params['article_id'])
    .then(err => {
      if (!err) next({ status: 404 });
      else {
        return res
          .status(204)
          .send(`Article ${req.params['article_id']} has been deleted`);
      }
    })
    .catch(next);
};
