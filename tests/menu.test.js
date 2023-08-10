const supertest = require('supertest');
const app = require('../app');
const { default: mongoose } = require('mongoose');
const Menu = require('../model/Menu');
const User = require('../model/User')

const api = supertest(app);

beforeAll(async () => {
    await Menu.deleteMany({})
    await User.deleteMany({})
    await api.post('/users/register/')
        .send({
            username: 'testUser1',
            phone: 21353467,
            email: "1testuser@gmail.com",
            password: 'test123',
            fullname: "TestUser"
        })

    login = await api.post('/users/login')
        .send({
            username: "testUser1",
            password: "test123"
        })

    token = login.body.token
});

describe('Menu API Tests', () => {
    // Test data for creating a menu
    const menuData = {
        menuName: 'Burger',
        price: 10.99,
    };

    test('Unauthorized users cannot get list of menus', async () => {
        await api.get('/menus/')
            .expect(401)
    })

    test('Registered users can add menu', async () => {

        await api.post('/menus/')
            .send(menuData)
            .set('authorization', `bearer ${token}`)
            .expect(200)

    })

    test('Registered users should get all menus', async () => {
        await api.get('/menus')
            .set('authorization', `bearer ${token}`)
            .expect(200);
    });

    test('Registered users should get a menu by ID', async () => {
        const newMenu = await api.post('/menus/').send(menuData).set('authorization', `bearer ${token}`)
        const menuId = newMenu.body.id;
        await api.get(`menus/${menuId}`)
            .set('authorization', `bearer ${token}`)
            .expect(200)
    });

    test('Registered users should update a menu by ID', async () => {
        const newMenu = await api.post('/menus/').send(menuData).set('authorization', `bearer ${token}`)
        const menuId = newMenu.body.id;
        const updatedMenuData = {
            menuName: 'Cheeseburger',
            price: 12.99,
        };
        await api.put(`menus/${menuId}`).send(updatedMenuData)
            .set('authorization', `bearer ${token}`)
            .expect(200)

    });



    test('Registered users should delete a menu by ID', async () => {
        const newMenu = await api.post('/menus/').send(menuData).set('authorization', `bearer ${token}`)
        const menuId = newMenu.body.id;
        await api.delete(`menus/${menuId}`)
            .set('authorization', `bearer ${token}`)
            .expect(204)
    });

    test('Unauthorized users cannot delete a menus by ID', async () => {
        const nonExistentMenuId = '64ccdaa6ec3def2d2e2ebf40'
        res = await api.delete(`/menus/${nonExistentMenuId}`)
            .set('authorization', `bearer ${token}`)
            .expect(404)
        expect(res.body.error).toMatch("Menu not found")
    });

    test('Registered users should not update a menu without ID', async () => {
        const nonExistentMenuId = '64ccdaa6ec3def2d2e2ebf40'
        const updatedMenuData = {
            menuName: 'Cheeseburger',
            price: 12.99,
        };
        res = await api.put(`/menus/${nonExistentMenuId}`).send(updatedMenuData)
            .set('authorization', `bearer ${token}`)
            .expect(404)
        expect(res.body.error).toMatch("Menu not found")

    });

});

afterAll(async () => mongoose.connection.close())
