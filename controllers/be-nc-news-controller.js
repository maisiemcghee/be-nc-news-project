const { fetchTopics } = require('../models/be-nc-news-model');
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