const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


const contractSchema = new mongoose.Schema({
    contractNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    listProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});


const Contract = mongoose.model('Contract', contractSchema);

function validateContract(contract) {
    const schema =Joi.object( {
        contractNumber: Joi.string().required(),
        listProducts: Joi.required()
    });
    return schema.validate(contract);
}


module.exports = {
    Contract,
    validateContract
}