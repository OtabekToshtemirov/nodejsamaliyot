const express = require('express');
const router = express.Router();
const {Product, validateProduct} = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).send(products);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.status(200).send(product);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
} );

router.post('/', async (req, res) => {
    const {error} = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let product = new Product({
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            category: req.body.category
        });
        product = await product.save();
        res.status(201).send("Successfull created product" + product);
    } catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
});

router.put('/:id', async (req, res) => {
    const {error} = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            model: req.body.model,
            price: req.body.price,
            category: req.body.category
        });
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.status(200).send(product);
    } catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.status(200).send(product);
    } catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
});

module.exports = router;