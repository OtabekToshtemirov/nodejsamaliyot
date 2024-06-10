const express = require('express');
const router = express.Router();
const { Inventory, validateInventory } = require('../models/Inventory');
const { Contract } = require('../models/Contract');  // Ensure correct path

router.get('/', async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('contract product');
        res.send(inventories);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('contract product');
        if (!inventory) return res.status(404).send('The inventory with the given ID was not found.');
        res.status(200).send(inventory);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
});

router.post('/', async (req, res) => {
    const { error } = validateInventory(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let inventory = new Inventory({
            contract: req.body.contract,
            product: req.body.product,
        });
        inventory = await inventory.save();
        res.status(201).send(inventory);
    } catch (ex) {
        res.status(500).send('Error message: ' + ex.message);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validateInventory(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, { contract: req.body.contract, product: req.body.product }, { new: true });
        if (!inventory) return res.status(404).send('The inventory with the given ID was not found.');
        res.status(200).send(inventory);
    } catch (ex) {
        res.status(500).send('Error message: ' + ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!inventory) return res.status(404).send('The inventory with the given ID was not found.');
        res.status(200).send(inventory);
    } catch (ex) {
        res.status(500).send('Error message: ' + ex.message);
    }
});

module.exports = router;
