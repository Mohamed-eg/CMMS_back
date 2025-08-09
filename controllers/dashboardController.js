// backend\controllers\dashboardController.js

const WorkOrder = require('../models/workOrderModel');

// GET /api/dashboard/summary
// Returns overall stats and the last 5 work orders
const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();

    const [total, inProgress, pending, overdue, last5WorkOrders] = await Promise.all([
      WorkOrder.countDocuments({}),
      WorkOrder.countDocuments({ status: 'In Progress' }),
      WorkOrder.countDocuments({ status: 'Pending' }),
      WorkOrder.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
      WorkOrder.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      stats: { total, inProgress, pending, overdue },
      last5WorkOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard summary.', error: err.message });
  }
};

module.exports = { getDashboardSummary }; 