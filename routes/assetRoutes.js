// backend/routes/assetRoutes.js

const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Joi = require('joi');

const assetSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  assetCode: Joi.string().required(),
  category: Joi.string().required(),
  location: Joi.string().required(),
  gpsCoordinates: Joi.string().required(),
  status: Joi.string().required(),
  lastMaintenance: Joi.date().optional().allow(null),
  nextMaintenance: Joi.date().optional().allow(null),
  condition: Joi.string().optional().allow(''),
  serialNumber: Joi.string().optional().allow(''),
  manufacturer: Joi.string().optional().allow(''),
  installDate: Joi.date().optional().allow(null),
  expectedLifespan: Joi.string().optional().allow(''),
  usageHours: Joi.number().optional().allow(null),
  flowRateAnomalies: Joi.number().optional().allow(null),
  serviceFrequency: Joi.string().optional().allow(''),
  photos: Joi.array().items(Joi.string()).optional(),
  specifications: Joi.object().optional(),
  maintenanceHistory: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      type: Joi.string().required(),
      technician: Joi.string().required(),
      duration: Joi.string().required()
    })
  ).optional()
});

// GET /assets - list all
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets.', error });
  }
});

// GET /assets/:id - get one
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findOne({ id: req.params.id });
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching asset.', error });
  }
});

// POST /assets - create
router.post('/', async (req, res) => {
  const { error } = assetSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Error adding the asset.', error: err });
  }
});

// PUT /assets/:id - update
router.put('/:id', async (req, res) => {
  const { error } = assetSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const asset = await Asset.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Error updating the asset.', error: err });
  }
});

// DELETE /assets/:id - remove
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findOneAndDelete({ id: req.params.id });
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });
    res.json({ message: 'Asset deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting the asset.', error: err });
  }
});

module.exports = router;
