// backend\routes\dashboard.js

const express = require('express');
const router = express.Router();
const { getDashboardSummary, getSidebarInfo } = require('../controllers/dashboardController');

// GET /api/dashboard/summary
router.get('/summary', getDashboardSummary);

// GET /api/dashboard/sidebarInfo
router.get('/sidebarInfo', getSidebarInfo);

module.exports = router; 