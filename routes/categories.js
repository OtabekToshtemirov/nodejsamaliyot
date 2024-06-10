const express = require('express');
const router = express.Router();
const { Category, validateCategory } = require('../models/Category');


router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    }
    catch (ex) {
        res.status(500).send('Something failed.');
    }
} );

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) { // Check if category is not found
            return res.status(404).send('The category with the given ID was not found.');
        }
        res.status(200).send(category);
    }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message); // Handle other errors
    }
});

router.post('/', async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let category = new Category({ name: req.body.name });
        category = await category.save();
        res.status(201).send(category);
    }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
} );

router.put('/:id', async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
        if (!category) return res.status(404).send('The category with the given ID was not found.');
        res.status(200).send(category); }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
} );

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send('The category with the given ID was not found.');
        res.status(200).send(category);
    }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
});



module.exports = router;

