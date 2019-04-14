const connection = require('../db/connection');

exports.fetchUsernames = () => {
  return connection('users').select('*');
};

exports.fetchUsername = username => {
  return connection('users')
    .select('*')
    .where('username', '=', username);
};
