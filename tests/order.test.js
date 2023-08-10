const supertest = require('supertest');
const app = require('../app'); 
const { default: mongoose } = require('mongoose');
const Order = require('../model/Order'); 
const User = require('../model/User'); 

const api = supertest(app);

beforeAll(async () => {
    await Order.deleteMany({})
    await User.deleteMany({})
    testuser = await api.post('/users/register/')
        .send({
            username: 'testUser1',
            phone: 21353467,
            email: "1testuser@gmail.com",
            password: 'test123',
            fullname: "TestUser"
        })
    
    testUserId = testuser.body.id;

    login = await api.post('/users/login')
        .send({
            username: "testUser1",
            password: "test123"
        })

    token = login.body.token
});

describe('Order Controller Tests', () => {
    

    test('Get all orders', async () => {
        const orderData = [
            { user: testUserId, totalAmount: 15.99, status: 'pending' },
            { user: testUserId, totalAmount: 25.99, status: 'completed' },
        ];
        await Order.create(orderData);
    
        const response = await api.get('/orders').set('authorization', `bearer ${token}`);

        expect(response.status).toBe(200);
    
        const orders = response.body;
        expect(orders).toHaveLength(orderData.length);
    });
    

    test('Get order by ID', async () => {
        const orderData = [
            { user: testUserId, totalAmount: 15.99, status: 'pending' },
            { user: testUserId, totalAmount: 25.99, status: 'completed' },
        ];
        await Order.create(orderData);
    
        const response = await api.get('/orders').set('authorization', `bearer ${token}`);

        expect(response.status).toBe(200);

        orderId = response.body.id;

        const res = await api.get(`orders/${orderId}`).set('authorization', `bearer ${token}`);

        expect(res.status).toBe(200);

    });

    test('Get orders by user', async () => {
       
    });

    test('Create order', async () => {
        const orderData = [
            { user: testUserId, totalAmount: 15.99, status: 'pending' },
            { user: testUserId, totalAmount: 25.99, status: 'completed' },
        ];
        const response = await api.post('/orders').send(orderData).set('authorization', `bearer ${token}`);

        expect(response.status).toBe(200);
        
    });

    test('Update order by ID', async () => {
        
    });

    test('Delete all orders', async () => {
       
    });

    test('Delete order by ID', async () => {
        
    });
});

afterAll(async () => mongoose.connection.close())
