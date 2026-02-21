const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');     //cors is a middleware, a security mechanism that allows controlled access to resources located outside of a given domain.
require('dotenv').config(); //load environment variables from .env file

const app = express(); //create express app

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})); //enable CORS for all origins and specified methods

app.use(express.json()); //middleware to parse incoming JSON requests

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/requests', require('./routes/requests')); //use requests routes for /api/requests path

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//start server on specified port