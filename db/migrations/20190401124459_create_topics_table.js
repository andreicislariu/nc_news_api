exports.up = function(knex, Promise) {
  return knex.schema.createTable('topics', topics => {
    topics
      .text('slug')
      .primary()
      .unique();
    topics.text('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('topics');
};
