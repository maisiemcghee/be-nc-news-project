const { getTopics, getEndpoints, getArticleById, getArticles} = require('../controllers/be-nc-news-controller');
const { handlePSQLErrors, handleCustomErrors, handle500Errors } = require('../controllers/errors-controller');
const express = require('express');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles)

//error handling

app.use(express.json());

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handle500Errors)

module.exports = app;