// backend\models\Stations.js

const mongoose = require('mongoose');

// Contact Info Schema
const ContactInfoSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  manager: { type: String, required: true },
});

// Station Info Schema
const StationInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  gpsCoordinates: { type: String, required: true },
  contactInfo: { type: ContactInfoSchema, required: true },
  operatingHours: { type: String, required: true },
  stationCode: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  establishedDate: { type: String, required: true },
  totalArea: { type: String, required: true },
  fuelBrands: { type: [String], required: true },
});

// Asset Schema
const AssetSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  lastMaintenance: { type: String, required: true },
  nextMaintenance: { type: String, required: true },
});

// Worker Schema with User Reference
const WorkerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'On Leave'], 
    default: 'Active' 
  },
  department: { 
    type: String, 
    default: 'General' 
  },
  shift: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Night', 'Flexible'], 
    default: 'Flexible' 
  }
});

// Photo Schema
const PhotoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  dateTaken: { type: String, required: true },
  photographer: { type: String, required: true },
});

// Main Station Schema
const StationsSchema = new mongoose.Schema({
  stationInfo: { type: StationInfoSchema, required: true },
  assets: { type: [AssetSchema], default: [] },
  Workers: { type: [WorkerSchema], default: [] },
  photos: { type: [PhotoSchema], default: [] },
}, {
  timestamps: true
});

// Virtual for populating worker details
StationsSchema.virtual('workersWithDetails', {
  ref: 'User',
  localField: 'Workers.user',
  foreignField: '_id'
});

// Ensure virtuals are included when converting to JSON
StationsSchema.set('toJSON', { virtuals: true });
StationsSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stations', StationsSchema);
