const express = require('express');
const router = express.Router();
const userController = require('../../controllers/User/userController');

// CRUD routes
router.post('/', userController.createUser);
router.get('/', userController.getUsers); // ?role=Admin or ?role=Stagiaire,Admin
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
