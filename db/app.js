const { getTopics, getEndpoints } = require('../controllers/be-nc-news-controller');
const express = require('express');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);


module.exports = app;