const connection = require('../db/connection');

exports.getAllTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};