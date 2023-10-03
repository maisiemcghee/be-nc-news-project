const db = require('../db/connection');
const { articleData, commentData } = require('../db/data/test-data');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article does not exist'})
        } 
        return result.rows[0];
    })
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
    .then((result) => {
        if (article_id > articleData.length) {
            return Promise.reject({status: 404, msg: 'article does not exist'})
        } 
        return result.rows;
    })
}