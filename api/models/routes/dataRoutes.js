const express = require('express');
const router = express.Router();
const Data = require('../models/dataModel');

// GET: Fetch all data
router.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// POST: Insert new data
router.post('/', async (req, res) => {
    const newData = new Data(req.body);
    try {
        await newData.save();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
});

// DELETE: Delete all data
router.delete('/', async (req, res) => {
    try {
        const result = await Data.deleteMany();
        res.json({ message: `${result.deletedCount} documents deleted` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
});

module.exports = router;
