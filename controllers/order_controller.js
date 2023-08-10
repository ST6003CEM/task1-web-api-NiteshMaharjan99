// controllers/orderController.js
const Order = require('../model/Order');
const Menu = require('../model/Menu')

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .then((orders) => res.json(orders))
        .catch(next);
};

exports.getOrderById = (req, res, next) => {
    Order.findOne({ _id: req.params.order_id, user: req.user.id })
        .then((order) => {
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        })
        .catch(next);
};

exports.getOrderByUser = (req, res, next) => {
    const userid = req.user._id;
    var arr = []
    Order.find({ user: userid, })
        .populate("menuOrdering")
        .then((data) => {
            data.map(data => {
                arr.push({
                    _id: data._id,
                    totalAmount: data.menuOrdering.totalAmount,
                    status: data.menuOrdering.status,
                })
            })
            console.log(arr)
            res.status(200).json({ success: true, data: arr });
        }).catch(next)

};

exports.createOrder = (req, res, next) => {
    const userid = req.user;
    const menuOrdering = req.params.id;


    Order.create({ menuOrdering, user: userid })
        .then((order) => res.status(201).json({ success: true, message: "Ordered Sucessful!!!" }))
        .catch(next);
};


exports.updateOrderById = (req, res, next) => {
    const query = { _id: req.params.order_id, user: req.user.id }
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

// Delete all order
exports.deleteAllOrder = (req, res, next) => {
    Order.deleteMany({})
        .then((reply) => res.status(204).end())
        .catch(next)
}

exports.deleteOrderById = (req, res, next) => {
    const query = { _id: req.params.order_id1 }
    Order.findOneAndDelete(query)
        .then((data) => {
            res.status(200).json({ message: 'Order Delete sucessful!!!' });
        }).catch(next)
};

