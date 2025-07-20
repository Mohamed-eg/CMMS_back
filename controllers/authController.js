// backend\controllers\authController.js

// Controls Login and Register Process

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

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });
    
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30', { expiresIn: '1h' });
    res.status(200).json({ message: 'LoginSuccessful!', token, user });
  } catch (err) {
    console.log(process.env.SECRET_KEY);
    res.status(500).json({ error: err.message });
  }
};


