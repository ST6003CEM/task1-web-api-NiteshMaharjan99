const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

menuSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString()
        delete returnedDocument._id
        delete returnedDocument.__v
    }
})

module.exports = mongoose.model("Menu", menuSchema);
