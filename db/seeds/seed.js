const { topicData, userData, articleData, commentData } = require('../data');
const {
  formatArticlesData,
  formatCommentsData
} = require('../../db/utils/utils');

exports.seed = function(knex, Promise) {
  return knex('topics')
    .insert(topicData)
    .then(() => knex('users').insert(userData))
    .then(() => {
      const updatedArticleData = formatArticlesData(articleData);
      return knex('articles')
        .returning(['article_id', 'title'])
        .insert(updatedArticleData);
    })
    .then(articles_table => {
      const updatedCommentsData = formatCommentsData(
        commentData,
        articles_table
      );
      return knex('comments').insert(updatedCommentsData);
    });
};
