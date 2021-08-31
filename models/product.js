const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },
    description: {
        type: String,
        required: true,
        maxlength: 3000
    },
    price: {
        type: Number,
        required:true,
        trim: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category'
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema);