const connection = require('../db/connection');

exports.getAllArticles = (req, res, next) => {
  const { author, topic, sort_by = 'created_at', order = 'desc' } = req.query;
  return (
    connection('articles')
      .select(
        'articles.author',
        'articles.title',
        'articles.article_id',
        'articles.body',
        'articles.votes',
        'articles.created_at',
        'articles.topic'
      )
      .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
      .count('comments as comment_count')
      // .modify(query => {
      //   if (author) query.where({ 'articles.author': author });
      //   if (topic) query.where({ topic });
      // })
      .groupBy('articles.article_id', 'articles.author')
      .orderBy(sort_by, order ? 'asc' : 'desc')
      .then(articles => {
        res.status(200).send({ articles });
      })
      .catch(next)
  );
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select(
      'articles.article_id',
      'articles.author',
      'articles.title',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'articles.topic'
    )
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .count('comments AS comment_count')
    .where('articles.article_id', '=', article_id)
    .groupBy('articles.article_id', 'articles.author')
    .then(article => {
      if (article.length === 0) next({ status: 404 });
      else res.send({ article });
    })
    .catch(next);
};

exports.patchArticleWithVotes = (req, res, next) => {
  if (typeof req.body.inc_votes === 'string') return next({ code: '22P02' });
  const inc_votes = req.body.inc_votes === undefined ? 0 : req.body.inc_votes;
  const { article_id } = req.params;
  return connection('articles')
    .select('*')
    .where('article_id', `${article_id}`)
    .modify(articleQuery => {
      if (inc_votes >= 0) articleQuery.increment('votes', inc_votes);
      else articleQuery.decrement('votes', Math.abs(inc_votes));
    })
    .returning('*')
    .then(article => {
      if (article.length === 0)
        return Promise.reject({ status: 404, message: 'Page not found' });
      [article] = article;
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticleByArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  return connection('articles')
    .select('*')
    .where({ 'articles.article_id': article_id })
    .del()
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
