const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define a sub-schema for profile details
const profileDetailsSchema = new mongoose.Schema({
  age: { type: String },
  gender: { type: String },
  occupation: { type: String },
});

// Define the main user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profileDetails: profileDetailsSchema,
}, { timestamps: true }); // Enable timestamps to track created and updated times

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password has changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check the password during login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
