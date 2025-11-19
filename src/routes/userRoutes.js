// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateProfileUpdate, validateSearch } = require('../middleware/validation');

// Perfil do usuário logado
router.get('/perfil', isAuthenticated, userController.getMyProfile);

// Ver perfil de outro usuário
router.get('/perfil/:id', isAuthenticated, userController.getUserProfile);

// Atualizar perfil
router.put('/perfil',
    isAuthenticated,
    upload.single('avatar'),
    validateProfileUpdate,
    handleUploadError,
    userController.updateProfile
);

// Buscar tatuadores
router.get('/busca', isAuthenticated, userController.searchTatuadores);

// Deletar conta
router.delete('/conta', isAuthenticated, userController.deleteAccount);

module.exports = router;
