const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const { methodNotAllowed } = require('../errors');

apiRouter
  .route('/')
  .get((req, res) =>
    res.json({
      endpoints: {
        topics: { address: '/api/topics', methods: ['GET'] },
        aticles: { address: '/api/articles', methods: ['GET'] },
        article: {
          address: '/api/articles/:article_id',
          methods: ['GET', 'PATCH']
        },
        article_comments: {
          address: '/api/articles/:article_id/comments',
          methods: ['GET', 'POST']
        },
        comments: {
          address: '/api/comments',
          methods: ['PATCH', 'DELETE']
        },
        user: { address: '/api/users/username', methods: ['GET'] }
      }
    })
  )
  .all(methodNotAllowed);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
