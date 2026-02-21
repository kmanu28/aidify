const mongoose = require('mongoose'); //import mongoose to define schema

// Define the schema for a Request
const requestSchema = new mongoose.Schema({
  name: String,
  location: String,
  service: String,
  keywords: String,
  description: String,
  phone: String,
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema); //export the Request model based on the schema