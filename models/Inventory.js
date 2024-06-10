const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Counter = require('./Counter');  // Ensure this path is correct

const inventorySchema = new Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    uniqueNumber: {
        type: String,
        unique: true,
    }
});

inventorySchema.pre('save', async function (next) {
    const inventory = this;
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'inventory' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        inventory.uniqueNumber = counter.seq.toString().padStart(7, '0');
        next();
    } catch (error) {
        next(error);
    }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

function validateInventory(inventory) {
    const schema = Joi.object({
        contract: Joi.string().required(),
        product: Joi.string().required()
    });
    return schema.validate(inventory);
}

module.exports = {
    Inventory,
    validateInventory
}
