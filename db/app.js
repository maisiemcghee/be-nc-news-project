const { getTopics } = require('../controllers/be-nc-news-controller');
const express = require('express');

const app = express();

app.get('/api/topics', getTopics);

module.exports = app;