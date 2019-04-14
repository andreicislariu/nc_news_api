const connection = require('../db/connection');

exports.fetchTopics = () => {
  return connection('topics').select('*');
};
