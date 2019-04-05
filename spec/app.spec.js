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
    xit('GET method returns status 404, no endpoint available for this url', () =>
      request
        .get('/api/noEndpointforUrl')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.eql('Page not found');
        }));
    xit('GET method responds with 200 and returns all available endpoints', () =>
      request
        .get('/api')
        .expect(200)
        .then(res => {
          expect(res.body.endpoints.length).to.eql(8);
        }));

    describe('/topics', () => {
      it('GET method returns status 200 and all topics', () =>
        request
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.contains.keys('slug', 'description');
            expect(body.topics).to.have.length(2);
            expect(body.topics[0].slug).to.equal('mitch');
          }));
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
    describe('/articles', () => {
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

    describe('/articles/:article_id', () => {
      it('GET status:200 returns a single article object', () => {
        return request
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.eql({
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
      it('PATCH method returns status 200 and increases votes by value passed', () =>
        request
          .patch('/api/articles/2')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          }));
      it('PATCH method returns status 200 and increases votes by value passed', () =>
        request
          .patch('/api/articles/2')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          }));
      it('PATCH method returns status 200 and upates votes even if value is negative', () => {
        const vote = { inc_votes: -5 };
        request
          .patch('/api/articles/3')
          .send(vote)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(-5);
          });
      });
      it('PATCH method returns status 200 and an unaltered article if no data is given', () =>
        request
          .patch('/api/articles/3')
          .send()
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(0);
          }));
      it('PATCH method returns status 400 if client tries to update votes with an incorrect data type', () => {
        const vote = { inc_votes: 'some text' };
        request
          .patch('/api/articles/3')
          .send(vote)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Bad request, invalid data type');
          });
      });
      it('PATCH method returns status 404 if client tries to update votes on non-existent article_id', () => {
        const vote = { inc_votes: 4 };
        request
          .patch('/api/articles/11111')
          .send(vote)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal('Page not found');
          });
      });
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
      it('DELETE status:204 deletes article from article list', () => {
        return request
          .delete('/api/articles/1')
          .expect(204)
          .then(() => {
            return request
              .get('/api/articles/1')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Page not found');
              });
          });
      });
    });
  });
});
