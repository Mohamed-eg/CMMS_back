// backend\models\workOrderModel.js

const mongoose = require('mongoose');

// Define the schema for a Work Order
const workOrderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed'] },
    createdAt: { type: Date, default: Date.now },
    dueDate: { 
  type: Date, 
  default: () => {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    return now;
  }
},
    equipment: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
});

// Create a model for the Work Order
const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);

module.exports = WorkOrder;
