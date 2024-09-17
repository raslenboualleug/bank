const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user');

// User sign-up route
router.post('/signup', userController.signUp);

// User login route
router.post('/login', userController.login);

// Get all users route
router.get('/users', userController.getAllUsers);

module.exports = router;
