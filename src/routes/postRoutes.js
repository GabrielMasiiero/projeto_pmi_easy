// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuthenticated, isTatuador } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validatePost } = require('../middleware/validation');

// Listar todos os posts (feed)
router.get('/', isAuthenticated, postController.getAllPosts);

// Página para criar novo post
router.get('/criar', isAuthenticated, (req, res) => {
    res.render('criar-post', { errorMessage: null });
});

// Buscar posts
router.get('/search', isAuthenticated, postController.searchPosts);

// Ver post específico
router.get('/:id', isAuthenticated, postController.getPostById);

// Criar post (apenas tatuadores podem criar posts inicialmente)
router.post('/',
    isAuthenticated,
    upload.single('image'),
    validatePost,
    handleUploadError,
    postController.createPost
);

// Atualizar post
router.put('/:id',
    isAuthenticated,
    upload.single('image'),
    handleUploadError,
    postController.updatePost
);

// Deletar post
router.delete('/:id', isAuthenticated, postController.deletePost);

// Curtir/Descurtir post
router.post('/:id/like', isAuthenticated, postController.toggleLike);

// Adicionar comentário
router.post('/:id/comments', isAuthenticated, postController.addComment);

// Deletar comentário
router.delete('/:id/comments/:commentId', isAuthenticated, postController.deleteComment);

module.exports = router;
