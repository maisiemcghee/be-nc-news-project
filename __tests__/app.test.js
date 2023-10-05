const app = require('../db/app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data/index.js');
const endpoints = require('../endpoints.json');


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('invalid endpoint error handling', () => {
    test('404 error for invalid endpoint', () => {
        return request(app)
        .get('/api/bananas')
        .expect(404)
    })
})

describe('GET /api/topics', () => {
    test('returns a 200 status code with correct body', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
    })
})

describe('GET /api', () => {
    test('returns a 200 status code and an object describing all the available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual({ endpoints })
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('returns a 200 status code and sends correct article to the client', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(body.article.article_id).toBe(1)
            expect(body.article.topic).toBe('mitch')
            expect(body.article.votes).toBe(100)
            expect(body.article.title).toBe('Living in the shadow of a great man')
        })
    })
    test('sends appropriate error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test('sends appropriate error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
})

describe('GET /api/articles', () => {
    test('returns a 200 status code and an array of articles sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            expect(body.articles).toBeSorted({ key: 'created_at', descending: true })
            body.articles.forEach((article) => {
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('number')
                expect(!article.body).toBe(true)
            })
        })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("returns a 200 status code and correct comments for specific article_id, sorted by most recent date", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11)
            expect(body.comments).toBeSorted({ key: 'created_at', descending: true })
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe('number')
                expect(typeof comment.votes).toBe('number')
                expect(typeof comment.created_at).toBe('string')
                expect(typeof comment.author).toBe('string')
                expect(typeof comment.body).toBe('string')
                expect(typeof comment.article_id).toBe('number')
            })
        })
    })
    test('returns a 200 status code and an empty array for article with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([])
        })
    })
    test('sends appropriate error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist')
        })
    })
    test('sends appropriate error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-a-number/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('returns a 201 status code, inserts a new comment and returns inserted comment back to the client', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'I love this'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({
                comment_id: 19,
                author: 'butter_bridge',
                body: "I love this",
                article_id: 1
            })
        })
    })
    test('sends appropriate error message when given a valid but non-existent id', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'I love this'
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('error! user input not found')
        })
    })
    test('sends appropriate error message when given an invalid id', () => {
        const newComment = {
            username: 'butter_bridge', 
            body: 'I love this'
        }
        return request(app)
        .post('/api/articles/not-a-number/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
    test('sends appropriate error message when there is a key missing in the inserted comment', () => {
        const newComment = {
            username: 'butter_bridge'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
    test('sends an appropriate error message when new comment is passed a key with a value of the wrong data type', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 10,
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
    test('sends appropriate error message when username is not found in the users database', () => {
        const newComment = {
            username: 'crazymaisie',
            body: 'I love this'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('error! user input not found')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('returns a 200 status code and an updated article', () => {
        const updateArticle = { inc_vote: -100 }
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                votes: 0
            })
        })
    })
    test('sends appropriate error message when given a valid but non-existent id', () => {
        const updateArticle = { inc_vote: 100 }
        return request(app)
        .patch('/api/articles/999')
        .send(updateArticle)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article not found')
        })
    })
    test('sends appropriate error message when given an invalid id', () => {
        const updateArticle = { inc_vote: 100 }
        return request(app)
        .patch('/api/articles/not-a-number')
        .send(updateArticle)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
    test('sends appropriate error message when updated vote object is passed a key with a value of the wrong data type', () => {
        const updateArticle = { inc_vote: 'one-hundred' }
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
    test('sends appropriate error message when updated vote object has a key missing', () => {
        const updateArticle = {}
        return request(app)
        .patch('/api/articles/1')
        .send(updateArticle)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request')
        })
    })
})