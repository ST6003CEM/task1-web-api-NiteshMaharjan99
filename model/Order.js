const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // Reference to the user who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // Array of products in the order
       menuid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'menuOrdering',
       },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
