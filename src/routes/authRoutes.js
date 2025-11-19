// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { redirectIfAuthenticated } = require('../middleware/auth');

// Exibir login/cadastro
router.get('/login', redirectIfAuthenticated, authController.renderLogin);

// Login (com validação)
router.post('/login', validateLogin, authController.login);

// Cadastro (com validação)
router.post('/cadastro', validateRegister, authController.register);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
