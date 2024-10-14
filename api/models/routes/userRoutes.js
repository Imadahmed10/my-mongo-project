// api/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../userModel'); // Import the User model

// Endpoint to register a new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // // Check if a user with the same email already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'User with this email already exists.' });
    // }

    // // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Create a new user with hashed password
    // const newUser = new User({
    //   firstName,
    //   lastName,
    //   email,
    //   phone,
    //   password: hashedPassword,
    // });

    // // Save the new user to the database
    // await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error saving user:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'This email is already registered.' });
    } else {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }
});

// Endpoint to log in a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    // Login successful - only returning user ID and email for security
    res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login error', error });
  }
});

// Endpoint to update user profile
router.post('/profile', async (req, res) => {
  try {
    const { userId, profileData } = req.body;

    // Find and update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileDetails: profileData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile.', error });
  }
});

module.exports = router;
