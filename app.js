const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getFilteredCompanies } = require('./filters'); // Import the filtering function
const userRoutes = require('./api/models/routes/userRoutes'); // Adjusted path to user routes

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI
const uri = "mongodb+srv://imadahmed4:O8asqLmonBAbTkTc@sponserapp.9xo4a.mongodb.net/?retryWrites=true&w=majority&appName=SponserApp";

// Connect to MongoDB
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000,
  socketTimeoutMS: 120000,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Use user routes
app.use('/api/users', userRoutes);
console.log('User routes connected at /api/users');

// GET: Fetch filtered companies based on region, employees, industry, or company name
app.get('/api/companies/filter', async (req, res) => {
  const { region, industry, companyName, minEmployees, maxEmployees } = req.query;

  console.log("Received filters:", { region, industry, companyName, minEmployees, maxEmployees });

  const hasValidFilters = region || industry || companyName || minEmployees || maxEmployees;

  if (!hasValidFilters) {
    console.log("No filters applied, returning empty result.");
    return res.status(200).json({
      message: 'No filters applied',
      data: [],
    });
  }

  try {
    const companies = await getFilteredCompanies({ region, industry, companyName, minEmployees, maxEmployees });
    
    if (companies.length === 0) {
      console.log('No companies found with the specified filters.');
    }

    res.status(200).json({
      message: 'Filtered companies',
      data: companies,
    });
  } catch (error) {
    console.error('Error in fetching companies:', error.message);
    res.status(500).json({
      message: 'Error fetching companies from the database',
      error: error.message,
    });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
