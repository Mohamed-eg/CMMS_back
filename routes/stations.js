// backend\routes\stations.js

const express = require('express');
const router = express.Router();
const Stations = require('../models/Stations'); // Import the Stations model

// CREATE - Create a new station
router.post('/', async (req, res) => {
    const { StationName, Location, Email, Phone, Station_Manager, Established_Date, GPS_Coordinates, License_Number,Station_Code,Fuel_Brands } = req.body;
    try {
        const station = new Stations({ StationName, Location, Email, Phone, Station_Manager, Established_Date, GPS_Coordinates, License_Number,Station_Code,Fuel_Brands });
        await station.save();
        res.status(201).json({ message: 'station Created Successfully!', station });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create station.', error: err.message });
    }
});

// READ - Get all stations
router.get('/', async (req, res) => {
    try {
        const station = await Stations.find();
        res.status(200).json(station);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stations.', error: err.message });
    }
});

// Update station
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { StationName, Location, Email, Phone, Station_Manager, Established_Date, GPS_Coordinates, License_Number, Station_Code,Fuel_Brands } = req.body;
  
    try {
      const updatedStation = await Stations.findByIdAndUpdate(
        id,
        { StationName, Location, Email, Phone, Station_Manager, Established_Date, GPS_Coordinates, License_Number, Station_Code,Fuel_Brands },
        { new: true } // Return the updated document
      );
  
      if (!updatedStation) {
        return res.status(404).json({ message: 'station not found' });
      }
  
      res.status(200).json(updatedStation);
    } catch (err) {
      res.status(500).json({ message: 'Error updating station', error: err.message });
    }
  });
  

// DELETE - Delete a station
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Stations.findByIdAndDelete(id);
        res.status(200).json({ message: 'station Deleted Successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete station.', error: err.message });
    }
});

module.exports = router;
