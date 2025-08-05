// backend\routes\stations.js

const express = require('express');
const router = express.Router();
const {
    createStation,
    getAllStations,
    getStationById,
    getAllStationsWithWorkers,
    getStationWorkers,
    getStationWorkersByRole,
    addWorkerToStation,
    removeWorkerFromStation,
    updateStation,
    deleteStation
} = require('../controllers/stationsController');

// CREATE - Create a new station
router.post('/', createStation);

// READ - Get all stations
router.get('/', getAllStations);

// READ - Get a specific station with populated workers
router.get('/:id', getStationById);

// READ - Get all stations with populated workers
router.get('/with-workers/all', getAllStationsWithWorkers);

// READ - Get workers of a specific station
router.get('/:id/workers', getStationWorkers);

// READ - Get workers by role at a specific station
router.get('/:id/workers/:role', getStationWorkersByRole);

// UPDATE - Add a worker to a station
router.post('/:id/workers', addWorkerToStation);

// UPDATE - Remove a worker from a station
router.delete('/:id/workers/:workerId', removeWorkerFromStation);

// UPDATE - Update a station
router.put('/:id', updateStation);

// DELETE - Delete a station
router.delete('/:id', deleteStation);

module.exports = router;
