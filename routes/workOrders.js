// backend\routes\workOrders.js

const express = require('express');
const WorkOrder = require('../models/workOrderModel');
const router = express.Router();

// CREATE - Create a new work order
router.post('/', async (req, res) => {
    const { title, Equipment_ID, Station_Name, priority, status, dueDate, Requested_By, Contact_Info, id, issueDescription, notes, photos, urgency, estimatedDuration } = req.body;
    try {
        const workOrder = new WorkOrder({ title, Equipment_ID, Station_Name, priority, status, dueDate, Requested_By, Contact_Info, id, issueDescription, notes, photos, urgency, estimatedDuration });
        await workOrder.save();
        res.status(201).json({ message: 'Work Order Created Successfully!', workOrder });
    } catch (err) {
        res.status(400).json({ message: 'Failed to create work order.', error: err.message });
    }
});

// READ - Get all work orders
router.get('/', async (req, res) => {
    try {
        const workOrders = await WorkOrder.find();
        res.status(200).json(workOrders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch work orders.', error: err.message });
    }
});

// READ - Get work order by ID
router.get('/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        const workOrder = await WorkOrder.findById(_id);
        if (!workOrder) {
            return res.status(404).json({ message: 'Work Order not found' });
        }
        res.status(200).json(workOrder);
        console.log(workOrder);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch work order.', error: err.message });
    }
});

// Update Work Order
router.put('/:id', async (req, res) => {
    const  WorkOrderID  = req.params.id;
    const { title, Equipment_ID, Station_Name, priority, status, dueDate, Requested_By, Contact_Info, id, issueDescription, notes, photos, urgency, estimatedDuration } = req.body;
  
    try {
      const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      WorkOrderID,
        { title, Equipment_ID, Station_Name, priority, status, dueDate, Requested_By, Contact_Info, id, issueDescription, notes, photos, urgency, estimatedDuration },
        { new: true } // Return the updated document
      );
  
      if (!updatedWorkOrder) {
        return res.status(404).json({ message: 'Work Order not found' });
      }
  
      res.status(200).json(updatedWorkOrder);
    } catch (err) {
      res.status(500).json({ message: 'Error updating Work Order', error: err.message });
    }
  });
  

// DELETE - Delete a work order
router.delete('/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        await WorkOrder.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Work Order Deleted Successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete work order.', error: err.message });
    }
});

module.exports = router;
