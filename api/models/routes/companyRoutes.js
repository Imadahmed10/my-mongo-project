const express = require('express');
const router = express.Router();
const Company = require('../models/Company'); 

// Fetch all companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// Fetch companies by filter
router.get('/companies/filter', async (req, res) => {
    const { employees, region, industry } = req.query;
    const filter = {};
    if (employees) filter['financials.employees'] = Number(employees);
    if (region) filter['contact.region'] = region;
    if (industry) filter.industry = industry;

    try {
        const companies = await Company.find(filter);
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching filtered data', error });
    }
});

module.exports = router;
