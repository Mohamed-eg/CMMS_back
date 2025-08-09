// backend\controllers\workOrdersStatsController.js

const WorkOrder = require('../models/workOrderModel');

const getWorkOrderStats = async (req, res) => {
  try {
    const now = new Date();
    const [total, inProgress, pending, overdue] = await Promise.all([
      WorkOrder.countDocuments({}),
      WorkOrder.countDocuments({ status: 'In Progress' }),
      WorkOrder.countDocuments({ status: 'Pending' }),
      WorkOrder.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
    ]);

    res.status(200).json({ total, inProgress, pending, overdue });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch work order stats.', error: err.message });
  }
};

module.exports = { getWorkOrderStats };