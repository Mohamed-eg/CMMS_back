// backend\routes\workOrdersStats.js

const express = require('express');
const router = express.Router();
const { getWorkOrderStats } = require('../controllers/workOrdersStatsController');

// STATS - Get counts of total, in-progress, pending, and overdue work orders
router.get('/stats', getWorkOrderStats);

module.exports = router; 