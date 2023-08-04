const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // Reference to the user who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Array of products in the order
        menus: [
            {
                menu: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Menu',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        // Total order amount
        totalAmount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            required: true,
            default: 'pending',
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
