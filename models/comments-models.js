const connection = require('../db/connection');

exports.fetchComments = (
  article_id,
  { sort_by = 'created_at', order = 'desc' }
) => {
  const columns = ['comment_id', 'votes', 'created_at', 'author', 'body'];
  const sortBy = columns.includes(sort_by) ? sort_by : 'created_at';
  const orderCheck = (order === 'asc') | (order === 'desc') ? order : 'desc';
  return connection('comments')
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.author',
      'comments.body'
    )
    .where({ article_id })
    .orderBy(sortBy, orderCheck);
};

exports.postComment = (article_id, author, body) => {
  return connection('comments')
    .insert({ article_id, author, body })
    .returning('*');
};

exports.patchComment = (comment_id, inc_votes = 0) => {
  return connection('comments')
    .where({ comment_id })
    .modify(builder => {
      if (inc_votes) builder.increment('votes', inc_votes);
    })
    .returning('*');
};

exports.deleteComment = comment_id => {
  return connection('comments')
    .where({ comment_id })
    .del();
};
