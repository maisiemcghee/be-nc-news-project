const { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId, insertComment, patchArticle, removeComment, fetchUsers, fetchArticlesByTopic } = require('../models/be-nc-news-model');
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
    const topic = req.query.topic
    return fetchArticlesByTopic(topic).then((articles) => {
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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id).then((comment) => {
        res.status(204).send()
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
    return fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch(next)
}