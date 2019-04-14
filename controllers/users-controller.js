const { fetchUsernames, fetchUsername } = require('../models/users-models');

exports.getAllUsers = (req, res, next) => {
  fetchUsernames()
    .then(users => {
      return res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  fetchUsername(req.params.username).then(user => {
    if (user === undefined) next({ status: 404 });
    else return res.status(200).send({ user });
  });
};
