// controllers/orderController.js
const Order = require('../model/Order');
const Menu = require('../model/Menu')

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .then((orders) => res.json(orders))
        .catch(next);
};

exports.getOrderById = async (req, res) => {
    try {

        const { user, menus, totalAmount, status } = req.body;
        const order = await Order.create({ user, menus, totalAmount, status });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error creating order' });
    }
};

exports.createOrder = (req, res, next) => {
    Menu.findOne({ id: req.body.menu })
        .then((menu) => {
            if (!batch) {
                return res.status(400).send({ message: "Invalid Menu" });
            }
            res.json(menu)
        }).catch(next);

    const { menu, totalAmount } = req.body;
    Order.create({ menu, totalAmount, user: req.user.id })
        .then((menu) => res.status(201).json(menu))
        .catch(next);
};


exports.updateOrderById = (req, res, next) => {
    const query = { _id: req.params.id, user: req.user.id }
    const { user, menus, totalAmount, status } = req.body;
    Order.findOneAndUpdate(
        query,
        { user, menus, totalAmount, status },
        { new: true }
    ).then((order) => {
        if (!order) {
            res.status(404)
            return next(new Error('Order not found'))
        }
        res.json(order)
    })
        .catch(next)

};

exports.deleteOrderById = (req, res, next) => {
    const query = { _id: req.params.id, user: req.user.id }
    Order.findOneAndDelete(query);
    if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });

};

