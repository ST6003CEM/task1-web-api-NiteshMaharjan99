const express = require("express");

const router = express.Router();

const Restaurant = require('../model/RestaurantPOS');

router.route('/')
    .get((req, res, next) => {
        Restaurant.find()
            .then(restaurant => res.json(restaurant))
            .catch(next)
    })
    .post((req, res, next) => {
        Restaurant.create(req.body)
            .then((restaurant) => res.status(201).json(restaurant))
            .catch(err => next(err))
    })
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })
    .delete((req, res, next) => {
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
    .put((req, res, next) => {
        Restaurant.findByIdAndUpdate(
            req.params.restaurant_id,
            { $set: req.body },
            { new: true }
        ).then(updated => res.json(updated))
            .catch(next)
    })
    .delete((req, res, next) => {
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
    .post((req, res, next) => {
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
    .delete((req, res, next) => {
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
    .put((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                // uncompleted

                // let table = restaurant.tables.id()
                // if (table.user != req.user.id) {
                //     return res.status(403).json({ error: 'you are not authorized' })
                // }
                restaurant.tables = restaurant.tables.map((r) => {
                    if (r._id == req.params.table_id) {
                        r.capacity = req.body.capacity
                        r.status = req.body.status
                        // r.user = req.body.user.id
                    }
                    return r
                })
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.tables.id(req.params.table_id))
                    }).catch(next)

            }).catch(next)
    })
    .delete((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                // let table = restaurant.tables.id()
                // if (table.user != req.user.id) {
                //     return res.status(403).json({ error: 'you are not authorized' })
                // }

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
    .post((req, res, next) => {
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
    .delete((req, res, next) => {
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
    .put((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                // uncompleted

                // let table = restaurant.tables.id()
                // if (table.user != req.user.id) {
                //     return res.status(403).json({ error: 'you are not authorized' })
                // }
                restaurant.menu = restaurant.menu.map((r) => {
                    if (r._id == req.params.menu_id) {
                        r.name = req.body.name
                        r.price = req.body.price
                        // r.user = req.body.user.id
                    }
                    return r
                })
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.menu.id(req.params.menu_id))
                    }).catch(next)

            }).catch(next)
    })
    .delete((req, res, next) => {
        Restaurant.findById(req.params.restaurant_id)
            .then((restaurant) => {
                if (!restaurant) return res.status(404).json({ error: 'restaurant not found ' })
                // let table = restaurant.tables.id()
                // if (table.user != req.user.id) {
                //     return res.status(403).json({ error: 'you are not authorized' })
                // }

                restaurant.menu = restaurant.menu.filter((r) => r._id != req.params.menu_id)
                restaurant.save()
                    .then(restaurant => {
                        res.json(restaurant.menu.id(req.params.menu_id))
                    }).catch(next)
            }).catch(next)
    })



module.exports = router;