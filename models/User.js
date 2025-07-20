// backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Avatar: { type: String, default: "N/A" },
  Email: { type: String, required: true, unique: true },
  Phone: { type: String, required: true },
  Station_Name: { type: String, default: "N/A" },
  Role: { type: String, required: true, enum: ["Admin", "Manager", "Technician"] },
  Status: { type: String, required: true, enum: ["Active", "Inactive"] },
  Password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
