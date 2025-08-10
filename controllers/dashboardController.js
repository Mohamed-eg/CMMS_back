// backend\controllers\dashboardController.js

const WorkOrder = require('../models/workOrderModel');
const Asset = require('../models/Asset');

// GET /api/dashboard/summary
// Returns overall stats and the last 5 work orders
const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();

    const [total, inProgress, pending, overdue, last5WorkOrders, assetsPerCategory, totalAssets, activeAssets] = await Promise.all([
      WorkOrder.countDocuments({}),
      WorkOrder.countDocuments({ status: 'In Progress' }),
      WorkOrder.countDocuments({ status: 'Pending' }),
      WorkOrder.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
      WorkOrder.find({}).sort({ createdAt: -1 }).limit(5),
      Asset.aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
            }
          }
        },
        { $project: { _id: 0, category: '$_id', total: 1, active: 1 } },
        { $sort: { category: 1 } }
      ]),
      Asset.countDocuments({}),
      Asset.countDocuments({ status: 'Active' })
    ]);

    res.status(200).json({
      stats: { total, inProgress, pending, overdue },
      last5WorkOrders,
      assetsSummary: {
        perCategory: assetsPerCategory,
        totals: {
          totalAssets,
          activeAssets
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard summary.', error: err.message });
  }
};

// GET /api/dashboard/sidebarInfo
// Returns total work orders, total assets, and station-specific work orders for managers
const getSidebarInfo = async (req, res) => {
  try {
    const { userRole, userStation } = req.query; // Get user info from query params

    // Get total counts
    const [totalWorkOrders, totalAssets] = await Promise.all([
      WorkOrder.countDocuments({}),
      Asset.countDocuments({})
    ]);

    let stationWorkOrders = null;

    // If user is a manager, get work orders for their assigned station
    if (userRole === 'Manager' && userStation) {
      stationWorkOrders = await WorkOrder.find({ 
        Station_Name: userStation 
      }).sort({ createdAt: -1 }).limit(10); // Get last 10 work orders for the station
    }

    res.status(200).json({
      totalWorkOrders,
      totalAssets,
      stationWorkOrders,
      userRole,
      userStation
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sidebar info.', error: err.message });
  }
};

module.exports = { getDashboardSummary, getSidebarInfo }; 