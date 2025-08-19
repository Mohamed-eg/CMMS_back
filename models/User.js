// backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, default: "N/A" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  station_Name: { type: String, default: "N/A" }, // Keep for backward compatibility
  station: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stations',
    required: false // Optional for now, can be made required later
  },
  role: { type: String, required: true, enum: ["Admin", "Manager", "Technician"] },
  status: { type: String, required: true, enum: ["Active", "Inactive"] },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// Virtual for getting station info
UserSchema.virtual('stationInfo', {
  ref: 'Stations',
  localField: 'station',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
