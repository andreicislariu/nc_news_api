const connection = require('../db/connection');

exports.fetchAllArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  username,
  ...otherQueries
}) => {
  const columns = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes'
  ];
  const sortBy = columns.includes(sort_by) ? sort_by : 'created_at';
  const orderCheck = (order === 'asc') | (order === 'desc') ? order : 'desc';
  return connection('articles')
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
    .count('articles.article_id AS comment_count')
    .groupBy('articles.article_id')
    .orderBy(sortBy, orderCheck)
    .where(query => {
      if (username) {
        query.where('articles.author', username);
      }
      for (let currQuery in otherQueries) {
        query.where(currQuery, otherQueries[currQuery]);
      }
    });
};

exports.fetchArticleById = article_id => {
  return connection('articles')
    .select(
      'articles.article_id',
      'articles.author',
      'articles.title',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'articles.topic'
    )
    .rightJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('articles.article_id AS comment_count')
    .groupBy('articles.article_id')
    .where({ 'articles.article_id': article_id });
};

exports.patchArticle = (article_id, inc_votes = 0) => {
  if (inc_votes) incVote = inc_votes;
  else incVote = 0;
  return connection('articles')
    .select(
      'articles.author',
      'title',
      'articles.body',
      'articles.article_id',
      'topic',
      'articles.created_at',
      'articles.votes'
    )
    .rightJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('articles.article_id AS comment_count')
    .groupBy('articles.article_id')
    .where({ 'articles.article_id': article_id })
    .modify(builder => {
      if (incVote > 0) builder.increment('votes', incVote);
    })
    .returning('*');
};

exports.deleteArticle = article_id => {
  return connection('articles')
    .select('*')
    .from('articles')
    .where({ 'articles.article_id': article_id })
    .del();
};
