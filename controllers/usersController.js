





const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Phone, Role, Status, Password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) return res.status(400).json({ message: 'User already exists!' });

    // Validate Role
    const validRoles = ["Admin", "Manager", "Technician"];
    if (!validRoles.includes(Role)) {
      return res.status(400).json({ message: 'Invalid role. Must be Admin, Manager, or Technician.' });
    }

    // Validate Status
    const validStatus = ["Active", "Inactive"];
    if (!validStatus.includes(Status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Active or Inactive.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    const user = new User({ FirstName, LastName, Email, Phone, Role, Status, Password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find({}, '-Password'); // Exclude password from results
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get user by ID
  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id, '-Password'); // Exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Update user by ID
  exports.updateUser = async (req, res) => {
    try {
      const { FirstName, LastName, Email, Phone, Role, Status } = req.body;
      const updateFields = { FirstName, LastName, Email, Phone, Role, Status };
      // Remove undefined fields
      Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true, runValidators: true, select: '-Password' }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Delete user by ID
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };