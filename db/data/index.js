const ENV = process.env.NODE_ENV || 'development';

const development = require('./dev-data');
const test = require('./test-data');
const production = require('./dev-data');

const data = {
  development,
  test,
  production
};
module.exports = data[ENV];
