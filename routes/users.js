
const express = require('express');
const { 
  CreateUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUsersWithStations,
  getUserByIdWithStation
} = require('../controllers/usersController');
const router = express.Router();

router.post('/', CreateUser);
router.get('/', getUsers); 
router.get('/with-stations', getUsersWithStations);
router.get('/:id', getUserById);
router.get('/:id/with-station', getUserByIdWithStation);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;