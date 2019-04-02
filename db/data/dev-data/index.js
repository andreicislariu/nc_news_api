// require in and export out all dev data
const articleData = require('./articles');
const commentData = require('./comments');
const topicData = require('./topics');
const userData = require('./users');

module.exports = { articleData, commentData, topicData, userData };
