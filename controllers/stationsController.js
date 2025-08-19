// backend\controllers\stationsController.js

const Stations = require('../models/Stations');

// CREATE - Create a new station
const createStation = async (req, res) => {
    try {
        const station = new Stations(req.body);
        await station.save();
        res.status(201).json({ message: 'Station Created Successfully!', station });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create station.', error: err.message });
    }
};

// READ - Get all stations
const getAllStations = async (req, res) => {
    try {
        const stations = await Stations.find();
        res.status(200).json(stations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stations.', error: err.message });
    }
};

// READ - Get all station names and IDs
const getAllStationNames = async (req, res) => {
    try {
        const stations = await Stations.find({}, 'stationInfo.name _id');
        const formattedStations = stations.map(station => ({
            name: station.stationInfo.name,
            _id: station._id
        }));
        res.status(200).json(formattedStations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch station names.', error: err.message });
    }
};

// SEARCH - Search stations by name
const searchStationsByName = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Station name is required for search.' });
        }

        // Case-insensitive search using regex
        const searchRegex = new RegExp(name.trim(), 'i');
        
        const stations = await Stations.find({
            'stationInfo.name': searchRegex
        }).populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar');

        if (stations.length === 0) {
            return res.status(200).json({
                message: 'No stations found matching the search criteria.',
                stations: [],
                searchTerm: name.trim()
            });
        }

        res.status(200).json({
            message: `Found ${stations.length} station(s) matching "${name.trim()}"`,
            stations,
            searchTerm: name.trim(),
            totalResults: stations.length
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to search stations.', error: err.message });
    }
};

// READ - Get a specific station with populated workers
const getStationById = async (req, res) => {
    try {
        const station = await Stations.findById(req.params.id)
            .populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar')
            .exec();
        
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        res.status(200).json(station);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch station.', error: err.message });
    }
};

// READ - Get all stations with populated workers
const getAllStationsWithWorkers = async (req, res) => {
    try {
        const stations = await Stations.find()
            .populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar')
            .exec();
        
        res.status(200).json(stations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stations with workers.', error: err.message });
    }
};

// READ - Get workers of a specific station
const getStationWorkers = async (req, res) => {
    try {
        const station = await Stations.findById(req.params.id)
            .populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar')
            .exec();
        
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        // Format the response to include all user data
        const workersWithFullData = station.Workers.map(worker => ({
            assignmentInfo: {
                assignedDate: worker.assignedDate,
                status: worker.status,
                department: worker.department,
                shift: worker.shift
            },
            userData: worker.user // This contains all the user information
        }));
        
        res.status(200).json({
            stationInfo: station.stationInfo,
            workers: workersWithFullData
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch station workers.', error: err.message });
    }
};

// READ - Get workers by role at a specific station
const getStationWorkersByRole = async (req, res) => {
    try {
        const station = await Stations.findById(req.params.id)
            .populate({
                path: 'Workers.user',
                match: { role: req.params.role },
                select: 'firstName lastName email phone role station_Name status joinDate avatar'
            })
            .exec();
        
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        // Filter out workers where user is null (due to role mismatch)
        const filteredWorkers = station.Workers.filter(worker => worker.user !== null);
        
        const workersWithFullData = filteredWorkers.map(worker => ({
            assignmentInfo: {
                assignedDate: worker.assignedDate,
                status: worker.status,
                department: worker.department,
                shift: worker.shift
            },
            userData: worker.user
        }));
        
        res.status(200).json({
            stationInfo: station.stationInfo,
            workers: workersWithFullData,
            role: req.params.role
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch station workers by role.', error: err.message });
    }
};

// UPDATE - Add a worker to a station
const addWorkerToStation = async (req, res) => {
    try {
        const { userId, department, shift, status } = req.body;
        
        const station = await Stations.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        // Check if worker is already assigned
        const existingWorker = station.Workers.find(worker => worker.user.toString() === userId);
        if (existingWorker) {
            return res.status(400).json({ message: 'Worker is already assigned to this station' });
        }
        
        station.Workers.push({
            user: userId,
            department: department || 'General',
            shift: shift || 'Flexible',
            status: status || 'Active'
        });
        
        await station.save();
        
        // Return the updated station with populated workers
        const updatedStation = await Stations.findById(req.params.id)
            .populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar')
            .exec();
        
        res.status(200).json({
            message: 'Worker assigned successfully',
            station: updatedStation
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to assign worker to station.', error: err.message });
    }
};

// UPDATE - Remove a worker from a station
const removeWorkerFromStation = async (req, res) => {
    try {
        const station = await Stations.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        
        station.Workers = station.Workers.filter(
            worker => worker.user.toString() !== req.params.workerId
        );
        
        await station.save();
        
        res.status(200).json({ message: 'Worker removed from station successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove worker from station.', error: err.message });
    }
};

// UPDATE - Update a station
const updateStation = async (req, res) => {
    const { id } = req.params;
  
    try {
        const updatedStation = await Stations.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        ).populate('Workers.user', 'firstName lastName email phone role station_Name status joinDate avatar');
  
        if (!updatedStation) {
            return res.status(404).json({ message: 'Station not found' });
        }
  
        res.status(200).json(updatedStation);
    } catch (err) {
        res.status(500).json({ message: 'Error updating station', error: err.message });
    }
};

// DELETE - Delete a station
const deleteStation = async (req, res) => {
    const { id } = req.params;
    try {
        await Stations.findByIdAndDelete(id);
        res.status(200).json({ message: 'Station Deleted Successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete station.', error: err.message });
    }
};

module.exports = {
    createStation,
    getAllStations,
    getAllStationNames,
    searchStationsByName,
    getStationById,
    getAllStationsWithWorkers,
    getStationWorkers,
    getStationWorkersByRole,
    addWorkerToStation,
    removeWorkerFromStation,
    updateStation,
    deleteStation
}; 