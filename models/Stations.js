// backend\models\Stations.js

const mongoose = require('mongoose');

const StationsSchema = new mongoose.Schema({
  StationName: { type: String, required: true },
  Location: { type: String, required: true},
  Phone: { type: String, required: true },
    Email: { type: String, required: true},
    Station_Manager: { type: String, required: true },
    Established_Date: { type: Date, default: Date.now },
    GPS_Coordinates:{ type: String, default: "N/A" },
    License_Number: { type: String, default: "N/A" },
    Station_Code: { type: String, default: "N/A"},
    Fuel_Brands: { type: [String], default: [] },
});

module.exports = mongoose.model('Stations', StationsSchema);
