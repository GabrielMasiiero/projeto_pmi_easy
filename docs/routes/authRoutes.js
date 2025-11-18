// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Exibir login/cadastro
router.get('/login', authController.renderLogin);

// Login
router.post('/login', authController.login);

// Cadastro
router.post('/cadastro', authController.register);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
