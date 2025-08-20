const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Stations = require('../models/Stations');

// Register a new user
exports.CreateUser = async (req, res) => {
  try {
    const { firstName, lastName, avatar, email, phone, station_Name, stationId, role, status, password, join_date } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(400).json({ message: 'User already exists!' });

    // Validate role
    const validRoles = ["Admin", "Manager", "Technician"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be Admin, Manager, or Technician.' });
    }

    // Validate status
    const validStatus = ["Active", "Inactive"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Active or Inactive.' });
    }

    // Validate station if provided
    let station = null;
    if (stationId) {
      station = await Stations.findById(stationId);
      if (!station) {
        return res.status(400).json({ message: 'Invalid station ID provided.' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      avatar: avatar || undefined,
      email: email,
      phone: phone,
      station_Name: station_Name || (station ? station.stationInfo.name : undefined),
      station: stationId || undefined,
      role: role,
      status: status,
      password: hashedPassword,
      joinDate: join_date || undefined
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find({}, '-Password').limit(8); // Limit to first 8 users
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get all users with populated station info
exports.getUsersWithStations = async (req, res) => {
    try {
      const users = await User.find({}, '-Password')
        .populate('station', 'stationInfo.name stationInfo.location stationInfo.stationCode')
        .exec();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get users with Manager role
exports.getManagers = async (req, res) => {
    try {
      const managers = await User.find({ role: 'Manager' }, '-Password')
        .populate('station', 'stationInfo.name stationInfo.location stationInfo.stationCode')
        .exec();
      
      res.status(200).json({
        message: `Found ${managers.length} manager(s)`,
        managers,
        totalManagers: managers.length
      });
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

// Get user by ID with populated station info
exports.getUserByIdWithStation = async (req, res) => {
    try {
      const user = await User.findById(req.params.id, '-Password')
        .populate('station', 'stationInfo.name stationInfo.location stationInfo.stationCode')
        .exec();
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
      const { firstName, lastName, email, phone, Role, Status, stationId } = req.body;
      const updateFields = { firstName, lastName, email, phone, Role, Status };
      
      // Handle station update if stationId is provided
      if (stationId) {
        const station = await Stations.findById(stationId);
        if (!station) {
          return res.status(400).json({ message: 'Invalid station ID provided.' });
        }
        updateFields.station = stationId;
        updateFields.station_Name = station.stationInfo.name;
      }
      
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