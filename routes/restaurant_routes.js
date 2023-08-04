const express = require("express");

const router = express.Router();

const Restaurant = require('../model/RestaurantPOS');

const { verifyAdmin } = require('../middlewares/auth')

router.route('/')
    .get((req, res, next) => {
        Restaurant.find()
            .then(restaurant => res.json(restaurant))
            .catch(next)
    })
    .post(verifyAdmin, (req, res, next) => {
        Restaurant.create(req.body)
            .then((restaurant) => res.status(201).json(restaurant))
            .catch(err => next(err))
    })
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.deleteMany()
            .then(reply => res.json(reply))
            .catch(next)
    })

router.route('/:restaurant_id')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                res.json(restaurant)
            })
            .catch(next)
    })
    .post((req, res) => {
        res.status(405).json({ error: 'POST request is not allowed' })
    })
    .put(verifyAdmin, (req, res, next) => {
        Restaurant.findByIdAndUpdate(
            req.params.restaurant_id,
            { $set: req.body },
            { new: true }
        ).then(updated => res.json(updated))
            .catch(next)
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.findByIdAndDelete(req.params.restaurant_id)
            .then(reply => res.status(204).end())
            .catch(next)
    })

// Routes for managing tables
router.route('/:restaurant_id/tables')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                res.json(restaurant.tables)
            })
            .catch(next)
    })
    .post(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                const table = {
                    number: restaurant.tables.length + 1,
                    capacity: req.body.capacity,
                    status: req.body.status
                };
                restaurant.tables.push(table)
                restaurant.save()
                    .then((restaurant) => {
                        res.status(201).json(restaurant.tables[restaurant.tables.length - 1]);
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                restaurant.tables = []

                restaurant.save()
                    .then(() => res.status(204).end())
                    .catch(next)
            })
            .catch(next)
    })

router.route('/:restaurant_id/tables/:table_id')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                const table = restaurant.tables.id(req.params.table_id)
                res.json(table)
            }).catch(next)
    })
    .put(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                restaurant.tables = restaurant.tables.map((r) => {
                    if (r._id == req.params.table_id) {
                        r.capacity = req.body.capacity
                        r.status = req.body.status
                    }
                    return r
                })
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.tables.id(req.params.table_id))
                    }).catch(next)

            }).catch(next)
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                restaurant.tables = restaurant.tables.filter((r) => r._id != req.params.table_id)
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.tables.id(req.params.table_id))
                    }).catch(next)
            }).catch(next)
    })

// Routes for managing menu
router.route('/:restaurant_id/menu')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                res.json(restaurant.menu)
            })
            .catch(next)
    })
    .post(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                const Menu = {
                    name: req.body.name,
                    price: req.body.price
                };
                restaurant.menu.push(Menu)
                restaurant.save()
                    .then((restaurant) => {
                        res.status(201).json(restaurant.menu[restaurant.menu.length - 1]);
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                restaurant.menu = []

                restaurant.save()
                    .then(() => res.status(204).end())
                    .catch(next)
            })
            .catch(next)
    })


router.route('/:restaurant_id/menu/:menu_id')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                const Menu = restaurant.menu.id(req.params.menu_id)
                res.json(Menu)
            }).catch(next)
    })
    .put(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })

                restaurant.menu = restaurant.menu.map((r) => {
                    if (r._id == req.params.menu_id) {
                        r.name = req.body.name
                        r.price = req.body.price
                    }
                    return r
                })
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.menu.id(req.params.menu_id))
                    }).catch(next)

            }).catch(next)
    })
    .delete(verifyAdmin, (req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                restaurant.menu = restaurant.menu.filter((r) => r._id != req.params.menu_id)
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.menu.id(req.params.menu_id))
                    }).catch(next)
            }).catch(next)
    })


// Routes for managing orders
router.route('/:restaurant_id/orders')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                res.json(restaurant.orders)
            })
            .catch(next)
    })
    .post((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }
                const tableNumber = req.body.tableNumber;
                if (!tableNumber) {
                    res.status(404).json({ error: 'Restaurant not found' })
                }


                const order = {
                    tableNumber: req.body.tableNumber,
                    items: restaurant.menu.map(menu => ({
                        name: menu.name,
                        price: menu.price,
                        quantity: req.body.items.find(item => item.name === menu.name).quantity
                    })),
                    totalAmount: req.body.items.reduce((total, item) => total + item.price * item.quantity, 0),
                    user: req.user.id
                };
                restaurant.orders.push(order)
                restaurant.save()
                    .then((restaurant) => {
                        res.status(201).json(restaurant.orders[restaurant.orders.length - 1]);
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })
    .delete((req, res, next) => {
        res.status(405).json({ error: "Delete request is not allowed" })
    })


router.route('/:restaurant_id/orders/:order_id')
    .get((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                const order = restaurant.orders.id(req.params.order_id)
                res.json(order)
            }).catch(next)
    })
    .put((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })

                let order = restaurant.orders.id(req.params.order_id)
                if (order.user != req.user.id) {
                    return res.status(403).json({ error: 'you are not authorized' })
                }
                restaurant.orders = restaurant.orders.map((r) => {
                    if (r._id == req.params.order_id) {
                        r.completed = req.body.completed
                        r.tableNumber = req.body.tableNumber
                        r.items = restaurant.menu.map(menuItem => ({
                            name: menuItem.name,
                            price: menuItem.price,
                            quantity: req.body.items.find(item => item.name === menuItem.name).quantity
                        })
                        )
                        r.totalAmount = req.body.items.reduce((total, item) => total + item.price * item.quantity, 0)

                    }
                    return r
                })

                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.orders.id(req.params.order_id))
                    }).catch(next)

            }).catch(next)
    })
    .delete((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                let order = restaurant.orders.id(req.params.order_id)
                if (order.user != req.user.id) {
                    return res.status(403).json({ error: 'you are not authorized' })
                }

                restaurant.orders = restaurant.orders.filter((r) => r._id != req.params.order_id)
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.orders.id(req.params.order_id))
                    }).catch(next)
            }).catch(next)
    })


module.exports = router;