exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', comments => {
    comments.increments('comment_id').primary();
    comments.text('author').references('users.username');
    comments.integer('article_id').references('articles.article_id');
    comments.integer('votes').defaultTo(0);
    comments.timestamp('created_at').defaultTo(knex.fn.now());
    comments.text('body');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
