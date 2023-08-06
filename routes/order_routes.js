const express = require('express')
const { verifyUser, verifyAdmin } = require('../middlewares/auth')
const orderController = require('../controllers/order_controller')

const router = express.Router()

router.post('/ordering/:id',
    verifyUser,orderController.createOrder
);

router.use(verifyUser).route('/')
    .get(orderController.getAllOrders)
    .delete(verifyAdmin,orderController.deleteAllOrder)

router.use(verifyUser).route('/:order_id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrderById)

router.delete('/:order_id1', verifyUser, orderController.deleteOrderById)


module.exports = router