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