const { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId } = require('../models/be-nc-news-model');
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

exports.getArticles = (req, res, next) => {
    return fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next)
}