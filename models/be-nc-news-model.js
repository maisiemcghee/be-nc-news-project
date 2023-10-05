const db = require('../db/connection');
const { articleData, commentData, userData } = require('../db/data/test-data');
const { createRef } = require('../db/seeds/utils')

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

const selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article does not exist'})
        } 
        return result.rows[0];
    })
}

const fetchArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then(({ rows }) => {
        return rows
    })
}

const selectCommentsByArticleId = (article_id) => {
    return selectArticleById(article_id)
    .then(() => {
        return db.query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY created_at DESC;`, [article_id])
    })
    .then((result) => {
        return result.rows;
    })
}

const insertComment = ({ username, body }, article_id ) => {
    if (typeof body != 'string' || typeof username != 'string') {
        return Promise.reject({status: 400, msg: 'bad request'})
    } 
    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`, [username, body, article_id])
    .then((result) => {
        return result.rows[0];
    })
}

const patchArticle = ( newVote, article_id) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [newVote.inc_vote, article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'article not found'})
        } 
        return result.rows[0]
    })
}

const removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
   .then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'comment does not exist'})
        }
        return result.rows[0]
    })
}


module.exports = { fetchTopics, selectArticleById, fetchArticles, selectCommentsByArticleId, insertComment, patchArticle, removeComment}