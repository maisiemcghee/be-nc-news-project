const { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId, insertComment, patchArticle } = require('../models/be-nc-news-model');
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

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    return insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.updateArticle = (req, res, next) => {
    const updateArticle = req.body;
    const { article_id } = req.params;
    return patchArticle(updateArticle, article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}