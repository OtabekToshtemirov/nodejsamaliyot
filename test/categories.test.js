const request = require('supertest');
const { Category } = require('../models/Category');
const mongoose = require('mongoose');
let server;

describe('/api/categories', () => {
    beforeEach(() => { server = require('../app'); });
    afterEach(async () => {
        await Category.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all categories', async () => {
            await Category.collection.insertMany([
                { name: 'category1' },
                { name: 'category2' }
            ]);

            const res = await request(server).get('/api/categories');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.name === 'category1')).toBeTruthy();
            expect(res.body.some(c => c.name === 'category2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a category if valid id is passed', async () => {
            const category = new Category({ name: 'category1' });
            await category.save();
            console.log('Saved category:', category);

            const res = await request(server).get('/api/categories/' + category._id);
            console.log('Response status:', res.status);
            console.log('Response body:', res.body);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', category.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/categories/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no category with the given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/categories/' + id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should save the category if it is valid', async () => {
            const res = await request(server)
                .post('/api/categories')
                .send({ name: 'category1' });

            const category = await Category.find({ name: 'category1' });
            console.log('Saved category:', category);

            expect(category).not.toBeNull();
        });

        it('should return the category if it is valid', async () => {
            const res = await request(server)
                .post('/api/categories')
                .send({ name: 'category1' });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'category1');
        });
    });
});
