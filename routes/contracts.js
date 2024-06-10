const express = require('express');
const router = express.Router();
const { Contract, validateContract } = require('../models/Contract');
const { Product } = require('../models/Product');


router.get('/', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.send(contracts);
    }
    catch (ex) {
        res.status(500).send('Something failed.');
    }
} );

router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).send('The contract with the given ID was not found.');
        res.status(200).send(contract);
    }
    catch (ex) {
        res.status(500).send('Something failed.');
    }
} );

router.post('/', async (req, res) => {
    const { error } = validateContract(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let contract = new Contract({
            contractNumber: req.body.contractNumber,
            listProducts: req.body.listProducts
        });
        contract = await contract.save();
        res.status(201).send(contract);
    }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
} );

router.put('/:id', async (req, res) => {
    const { error } = validateContract(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const contract = await Contract.findByIdAndUpdate(req.params.id, { contractNumber: req.body.contractNumber, listProducts: req.body.listProducts });
        if (!contract) return res.status(404).send('The contract with the given ID was not found.');
        res.status(200).send(contract); }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
} );

router.delete('/:id', async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) return res.status(404).send('The contract with the given ID was not found.');
        res.status(200).send(contract);
    }
    catch (ex) {
        res.status(500).send('Error message :' + ex.message);
    }
});


module.exports = router;