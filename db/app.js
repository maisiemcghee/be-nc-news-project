const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleId, postComment } = require('../controllers/be-nc-news-controller');
const { handlePSQLErrors, handleCustomErrors, handle500Errors } = require('../controllers/errors-controller');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

//error handling

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handle500Errors)

module.exports = app;