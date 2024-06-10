const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);


function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().required(),
        model: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required()
    });
    return schema.validate(product);
}



module.exports = {
    Product,
    validateProduct,
    productSchema
};