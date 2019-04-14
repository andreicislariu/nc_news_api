process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() =>
    connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run())
  );
  after(() => {
    connection.destroy();
  });

  describe('/api', () => {
    describe('DEFAULT GET BEHAVIOUR', () => {
      it('GET status:200', () => {
        return request
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body.endpoints).to.eql({
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
            });
          });
      });
    });
    describe('/topics', () => {
      describe('DEFAULT GET BEHAVIOUR', () => {
        it('GET method returns status 200 and all topics', () =>
          request
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics[0]).to.contain.keys('slug', 'description');
              expect(body.topics).to.have.length(2);
              expect(body.topics[0].slug).to.equal('mitch');
            }));
      });
      describe('DEFAULT PATCH BEHAVIOUR', () => {
        it('PATCH method returns status 405, you should be more specific with path/endpoint', () =>
          request
            .patch('/api/topics')
            .send({ slug: 'sddasd', description: 'eccwom' })
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'Method not allowed, you should be more specific with path/endpoint'
              );
            }));
      });
      describe('DEFAULT DELETE BEHAVIOUR', () => {
        it('DELETE method returns status 405, you should be more specific with path/endpoint', () =>
          request
            .delete('/api/topics')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'Method not allowed, you should be more specific with path/endpoint'
              );
            }));
      });
    });
    describe('/articles', () => {
      describe('DEFAULT GET BEHAVIOUR', () => {
        it('GET status:200 returns a article list of length n with correct keys', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.length(12);
              body.articles.forEach(article => {
                expect(article).to.contain.keys(
                  'article_id',
                  'title',
                  'body',
                  'votes',
                  'topic',
                  'author',
                  'created_at'
                );
              });
            });
        });
      });

      describe('/:article_id', () => {
        describe('DEFAULT GET BEHAVIOUR', () => {
          it('GET status:200 returns a single article object', () => {
            return request
              .get('/api/articles/1')
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.eql({
                  author: 'butter_bridge',
                  title: 'Living in the shadow of a great man',
                  article_id: 1,
                  body: 'I find this existence challenging',
                  topic: 'mitch',
                  created_at: '2018-11-15T12:21:54.171Z',
                  votes: 100,
                  comment_count: '13'
                });
              });
          });
          it('GET method returns status 400 if client enters article_id of wrong data type', () =>
            request
              .get('/api/articles/texthere')
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.equal('Bad request, invalid data type');
              }));
          it('GET method returns status 404 if client enters article_id that does not exist', () =>
            request
              .get('/api/articles/11111')
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal('Page not found');
              }));
        });
        describe('DEFAULT PATCH BEHAVIOUR', () => {
          it('PATCH status: 200 updates article data when given a specific article_id', () => {
            return request
              .patch('/api/articles/6')
              .expect(200)
              .send({ inc_votes: 1 })
              .then(({ body }) => {
                expect(body.article.votes).to.equal(1);
              });
          });
          it('PATCH status: 201 updates article data when given a specific article_id', () => {
            return request
              .patch('/api/articles/1')
              .expect(201)
              .send({ inc_votes: 10 })
              .then(({ body }) => {
                expect(body.article.votes).to.equal(110);
              });
          });
          it('PATCH method returns status 200 and an unaltered article if no data is given', () => {
            request
              .patch('/api/articles/3')
              .send()
              .expect(200)
              .then(res => {
                expect(res.body.article.votes).to.equal(0);
              });
          });
        });
        describe('ERROR HANDLING', () => {
          it('status: 404 for a non-existent id wrong file path', () => {
            return request.patch('/api/comments/1000').expect(404);
          });
          it('status: 400 for a non-existent id wrong format', () => {
            return request.patch('/api/comments/ten').expect(400);
          });
          it('status: 405 for an invalid method', () => {
            const invalidMethods = ['post'];
            const methodPromises = invalidMethods.map(method =>
              request[method]('/api/comments/1').expect(405)
            );
            return Promise.all(methodPromises);
          });
        });
        describe('DEFAULT DELETE BEHAVIOUR', () => {
          it('DELETE method returns status 204 and and an empty object', () =>
            request
              .delete('/api/articles/10')
              .expect(204)
              .then(res => {
                expect(res.body).to.eql({});
              })
              .then(() => request.get('/api/articles/10').expect(404))
              .then(res => {
                expect(res.body.msg).to.equal('Page not found');
              }));
          it('DELETE method returns status 404 if client tries to delete an article that does not exist', () =>
            request
              .delete('/api/articles/1111')
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal('Page not found');
              }));
          it('DELETE method returns status 400 if client tries to delete an article given in incorrect syntax', () =>
            request
              .delete('/api/articles/sometext')
              .expect(400)
              .then(res => {
                expect(res.body.msg).to.equal('Bad request, invalid data type');
              }));
        });
      });
    });
  });
  describe('/comments', () => {
    it('GET method returns status 200 and an array of comments with default queries', () =>
      request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(res => {
          console.log(res);
          expect(res.body.comments).to.have.length(10);
          expect(res.body.comments[0].comment_id).to.equal(18);
        }));
  });
  // describe('/users', () => {
  //   describe('DEFAULT GET BEHAVIOUR', () => {
  //     it('GET method returns status 200 and an array of user objects', () =>
  //       request
  //         .get('/api/users')
  //         .expect(200)
  //         .then(res => {
  //           expect(res.body.users).to.have.length(3);
  //           expect(res.body.users[0].name).to.equal('jonny');
  //           expect(res.body.users[0]).to.contain.keys([
  //             'username',
  //             'avatar_url',
  //             'name'
  //           ]);
  //         }));
  //   });
  //   describe('DEFAULT PATCH BEHAVIOUR', () => {
  //     it('PATCH method returns status 405, you should be more specific with path/endpoint', () =>
  //       request
  //         .patch('/api/topics')
  //         .send({ slug: 'sddasd', description: 'eccwom' })
  //         .expect(405)
  //         .then(res => {
  //           expect(res.body.msg).to.equal(
  //             'Method not allowed, you should be more specific with path/endpoint'
  //           );
  //         }));
  //   });
  //   describe('DEFAULT DELETE BEHAVIOUR', () => {
  //     it('DELETE method returns status 405, you should be more specific with path/endpoint', () =>
  //       request
  //         .delete('/api/users')
  //         .expect(405)
  //         .then(res => {
  //           expect(res.body.msg).to.equal(
  //             'Method not allowed, you should be more specific with path/endpoint'
  //           );
  //         }));
  //   });
  //   describe('username', () => {
  //     it('GET method returns status 200 and a user object', () =>
  //       request
  //         .get('/api/users/rogersop')
  //         .expect(200)
  //         .then(res => {
  //           expect(res.body.user[0]).to.contain.keys([
  //             'username',
  //             'avatar_url',
  //             'name'
  //           ]);
  //         }));
  //   });
  // });
  describe('/users', () => {
    describe('/:user_id', () => {
      describe('DEFAULT GET BEHAVIOUR', () => {
        it('POST status:200 returns specified user with correct keys', () => {
          return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(res => {
              expect(res.body.user).to.contain.keys(
                'username',
                'avatar_url',
                'name'
              );
            });
        });
      });
      describe('ERRORS', () => {
        it('GET status:404 responds with error message when ID not found', () => {
          const methods = ['get'];
          return Promise.all(
            methods.map(method => {
              return request[method]('/api/users/123')
                .expect(404)
                .then(res => {
                  expect(res.body.msg).to.equal('Page not found');
                });
            })
          );
        });
        it('status:405 responds with error message when method not allowed', () => {
          const methods = ['delete', 'put', 'patch', 'post'];
          return Promise.all(
            methods.map(method => {
              return request[method]('/api/users/1')
                .expect(405)
                .then(res => {
                  expect(res.body.msg).to.equal(
                    'Method not allowed, you should be more specific with path/endpoint'
                  );
                });
            })
          );
        });
        it('status:405 responds with error message when method not allowed', () => {
          const methods = ['delete', 'put', 'patch', 'post'];
          return Promise.all(
            methods.map(method => {
              return request[method]('/api')
                .expect(405)
                .then(res => {
                  expect(res.body.msg).to.equal(
                    'Method not allowed, you should be more specific with path/endpoint'
                  );
                });
            })
          );
        });
      });
    });
  });
});
