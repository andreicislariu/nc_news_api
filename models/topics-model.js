const connection = require('../db/connection');

function getAllTopics(req) {
  return connection.select('*').from('topics');
}

module.exports = { getAllTopics };
