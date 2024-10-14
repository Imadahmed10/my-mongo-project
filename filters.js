const Company = require('./api/models/dataModel');

const getFilteredCompanies = async (filters) => {
  const { region, industry, companyName, minEmployees, maxEmployees } = filters;
  let query = {};

  // Apply region filter if provided
  if (region) {
    query['Region'] = region;
  }

  // Apply company name filter (case-insensitive partial match)
  if (companyName) {
    query['Company Name'] = { $regex: companyName, $options: 'i' };
  }

  // Apply industry filter
  if (industry) {
    query['Industry'] = { $regex: industry, $options: 'i' };
  }

  // Apply employee range filter
  if (minEmployees !== undefined || maxEmployees !== undefined) {
    query['No. of Employees'] = {};
    
    // Ensure minEmployees and maxEmployees are integers before applying filters
    if (minEmployees !== undefined) {
      query['No. of Employees'].$gte = parseInt(minEmployees, 10);
    }
    if (maxEmployees !== undefined) {
      query['No. of Employees'].$lte = parseInt(maxEmployees, 10);
    }
  }

  console.log('Generated Query:', JSON.stringify(query, null, 2));

  try {
    const companies = await Company.find(query);
    console.log('Companies found:', companies.length);
    return companies;
  } catch (error) {
    console.error('Error querying companies:', error);
    throw error;
  }
};

module.exports = { getFilteredCompanies };
