
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_DATABASE,)
    .then(r => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const contractsRouter = require('./routes/contracts');
const inventoriesRouter = require('./routes/inventories');

app.get('/', (req, res) => {
    res.send('Welcome to the Contract Management System');
});
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/inventories', inventoriesRouter);

const port = process.env.PORT || 5006;

app.listen(port, () => console.log(`Listening on port ${port}...`));

