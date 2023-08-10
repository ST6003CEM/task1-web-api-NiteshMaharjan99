const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const User = require('../model/User')

const api = supertest(app)

beforeAll(async () => {
    await User.deleteMany({})
})

test('User can be registerd', async () => {
    await api.post('/users/register')
        .send({
            username: 'testUser1',
            phone: 21353467,
            email: "1testuser@gmail.com",
            password: 'test123',
            fullname: "TestUser"
        }).expect(201)
})

test('Duplicate Username cannot be registered', async () => {
    res = await api.post('/users/register')
        .send({
            username: 'testUser1',
            phone: 21353467,
            email: "1testuser@gmail.com",
            password: 'test123',
            fullname: "TestUser"
        }).expect(400)
    expect(res.body.error).toBeDefined()
    expect(res.body.error).toMatch(/already registered/)
})

test('missing fullname cannot be registered', async () => {
    res = await api.post('/users/register')
        .send({
            username: 'testUser12',
            phone: 21353467,
            email: "1testuser@gmail.com",
            password: 'test123'
        }).expect(400)
    expect(res.body.error).toBeDefined()
    expect(res.body.error).toMatch(/validation failed/)
})

describe('Register user can login ', () => {
    test('User logged in', async () => {
        await api.post('/users/login')
            .send({
                username: 'testUser1',
                password: 'test123'
            }).expect(200)
    })


    test('Unregistered User cannot be logged in', async () => {
        await api.post('/users/login')
            .send({
                username: 'testUser13',
                password: 'test123'
            }).expect(401)
        expect(res.body.error).toBeDefined()
        // expect(res.body.error).toMatch(/User validation failed: fullname: Path `fullname` is required./)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})