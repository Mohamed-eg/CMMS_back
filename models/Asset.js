// backend\models\Asset.js

const mongoose = require('mongoose');

const MaintenanceHistorySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  technician: { type: String, required: true },
  duration: { type: String, required: true }
}, { _id: false });

const AssetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  assetCode:{ type: String, required: true, unique: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  gpsCoordinates: { type: String, required: true },
  status: { type: String, required: true },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  condition: { type: String },
  serialNumber: { type: String },
  manufacturer: { type: String },
  installDate: { type: Date },
  expectedLifespan: { type: String },
  usageHours: { type: Number },
  flowRateAnomalies: { type: Number },
  serviceFrequency: { type: String },
  photos: { type: [String], default: [] },
  specifications: { type: Object },
  maintenanceHistory: { type: [MaintenanceHistorySchema], default: [] }
});

module.exports = mongoose.model('Asset', AssetSchema);
