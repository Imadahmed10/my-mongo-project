const mongoose = require('mongoose');

// Define schema for your data
const DataSchema = new mongoose.Schema({
    'Company Name': String,
    'Company Number': String,
    'First Name': String,
    'Last Name': String,
    'Region': String,
    'Industry': String,
    'No. of Employees': Number,
    // Add other fields as needed
}, { collection: 'Company_data' });  // Ensure the collection name is correct

// Create and export the model
module.exports = mongoose.model('Company_data', DataSchema, 'Company_data');
