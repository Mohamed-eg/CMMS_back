// backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, default: "N/A" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  station_Name: { type: String, default: "N/A" },
  role: { type: String, required: true, enum: ["Admin", "Manager", "Technician"] },
  status: { type: String, required: true, enum: ["Active", "Inactive"] },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
