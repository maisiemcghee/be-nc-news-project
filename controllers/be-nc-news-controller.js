const { fetchTopics, selectArticleById } = require('../models/be-nc-news-model');
const endpoints = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
    return fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getEndpoints = (req, res, next) => {
    return res.status(200).send({ endpoints })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article });
    })
    .catch((next))
}