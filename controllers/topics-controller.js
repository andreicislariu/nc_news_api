const { getAllTopics } = require('../models/topics-model');

exports.getAllTopics = (req, res, next) => {
  getAllTopics(req)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
