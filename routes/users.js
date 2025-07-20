
const express = require('express');
const { registerUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/usersController');
const router = express.Router();

router.post('/', CreateUser);
router.get('/', getUsers); 
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;