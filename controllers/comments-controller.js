const {
  fetchComments,
  postComment,
  patchComment,
  deleteComment
} = require('../models/comments-models');

exports.getCommentsByArticle_id = (req, res, next) => {
  fetchComments(req.params['article_id'], req.query)
    .then(comments => {
      if (comments.length === 0 || comments === undefined)
        next({ status: 404 });
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticle_id = (req, res, next) => {
  postComment(req.params['article_id'], req.body['username'], req.body['body'])
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchCommentWithVotes = (req, res, next) => {
  if (
    Object.keys(req.body).length > 1 ||
    (!req.body.inc_votes && Object.keys(req.body).length === 1)
  )
    next({ status: 400 });
  else {
    patchComment(req.params['comment_id'], req.body['inc_votes'])
      .then(([comment]) => {
        if (comment === undefined) next({ status: 404 });
        else return res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.deleteCommentByArticle_id = (req, res, next) => {
  deleteComment(req.params['comment_id'])
    .then(err => {
      if (!err) next({ status: 404 });
      else return res.status(204).send();
    })
    .catch(next);
};
