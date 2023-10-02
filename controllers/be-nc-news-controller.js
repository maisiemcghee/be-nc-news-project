const { fetchTopics } = require('../models/be-nc-news-model');

exports.getTopics = (req, res) => {
    return fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
}