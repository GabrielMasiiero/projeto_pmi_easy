// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

/**
 * Listar todos os posts (feed)
 */
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'nome email tipo')
            .lean();

        const total = await Post.countDocuments({ isActive: true });
        const totalPages = Math.ceil(total / limit);

        // Se for requisição API
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                posts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalPosts: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        }

        // Renderizar view
        res.render('feed', {
            posts,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).render('500', { message: 'Erro ao carregar o feed' });
    }
};

/**
 * Obter post específico
 */
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'nome email tipo')
            .populate('comments.user', 'nome');

        if (!post) {
            return res.status(404).render('404', { message: 'Post não encontrado' });
        }

        // Incrementar visualizações
        await post.incrementViews();

        // Se for requisição API
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({ post });
        }

        res.render('post-detail', { post });
    } catch (error) {
        console.error('Erro ao buscar post:', error);
        res.status(500).render('500', { message: 'Erro ao carregar o post' });
    }
};

/**
 * Criar novo post
 */
const createPost = async (req, res) => {
    try {
        const { description, tags, estilos } = req.body;
        
        console.log('📝 Criando post...');
        console.log('Usuário:', req.session.user?.nome);
        console.log('Tags recebidas:', tags, 'Tipo:', typeof tags);

        if (!req.file) {
            return res.status(400).render('criar-post', { 
                errorMessage: 'Imagem é obrigatória' 
            });
        }

        const imageUrl = `/uploads/posts/${req.file.filename}`;

        // Tags já foram processadas pelo sanitizer do validation.js
        const tagsArray = Array.isArray(tags) ? tags : [];

        // Processar estilos
        let estilosArray = [];
        if (estilos) {
            estilosArray = Array.isArray(estilos) ? estilos : [estilos];
        }        const newPost = new Post({
            author: req.session.user.id,
            authorName: req.session.user.nome,
            authorType: req.session.user.tipo,
            description,
            imageUrl,
            tags: tagsArray,
            estilos: estilosArray
        });

        await newPost.save();
        console.log('✅ Post criado com sucesso:', newPost._id);

        // Se for requisição API
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(201).json({
                message: 'Post criado com sucesso!',
                post: newPost
            });
        }

        res.redirect('/posts');
    } catch (error) {
        console.error('Erro ao criar post:', error);

        // Remover imagem se houver erro
        if (req.file) {
            const imagePath = path.join(__dirname, '../../uploads/posts', req.file.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(500).json({ error: 'Erro ao criar post' });
    }
};

/**
 * Atualizar post
 */
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Verificar se é o autor
        if (post.author.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este post' });
        }

        const { description, tags, estilos } = req.body;

        post.description = description || post.description;
        post.tags = tags ? (Array.isArray(tags) ? tags : [tags]) : post.tags;
        post.estilos = estilos ? (Array.isArray(estilos) ? estilos : [estilos]) : post.estilos;

        // Se houver nova imagem
        if (req.file) {
            // Remover imagem antiga
            const oldImagePath = path.join(__dirname, '../..', post.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            post.imageUrl = `/uploads/posts/${req.file.filename}`;
        }

        await post.save();

        res.json({
            message: 'Post atualizado com sucesso!',
            post
        });
    } catch (error) {
        console.error('Erro ao atualizar post:', error);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
};

/**
 * Deletar post
 */
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Verificar se é o autor
        if (post.author.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este post' });
        }

        // Remover imagem
        const imagePath = path.join(__dirname, '../..', post.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Soft delete
        post.isActive = false;
        await post.save();

        // Ou hard delete:
        // await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        res.status(500).json({ error: 'Erro ao deletar post' });
    }
};

/**
 * Curtir/Descurtir post
 */
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const userId = req.session.user.id;
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            await post.removeLike(userId);
        } else {
            await post.addLike(userId);
        }

        res.json({
            message: hasLiked ? 'Like removido' : 'Post curtido',
            likesCount: post.likesCount,
            hasLiked: !hasLiked
        });
    } catch (error) {
        console.error('Erro ao curtir post:', error);
        res.status(500).json({ error: 'Erro ao curtir post' });
    }
};

/**
 * Adicionar comentário
 */
const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Comentário não pode estar vazio' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        await post.addComment(
            req.session.user.id,
            req.session.user.nome,
            text.trim()
        );

        res.json({
            message: 'Comentário adicionado com sucesso!',
            commentsCount: post.commentsCount
        });
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).json({ error: 'Erro ao adicionar comentário' });
    }
};

/**
 * Deletar comentário
 */
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        // Verificar se é o autor do comentário ou do post
        if (comment.user.toString() !== req.session.user.id &&
            post.author.toString() !== req.session.user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este comentário' });
        }

        await post.removeComment(commentId);

        res.json({
            message: 'Comentário deletado com sucesso!',
            commentsCount: post.commentsCount
        });
    } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
};

/**
 * Buscar posts por tags ou estilos
 */
const searchPosts = async (req, res) => {
    try {
        const { query, tags, estilos, authorType } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let filter = { isActive: true };

        if (query) {
            filter.$or = [
                { description: { $regex: query, $options: 'i' } },
                { authorName: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }

        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : [tags];
            filter.tags = { $in: tagsArray };
        }

        if (estilos) {
            const estilosArray = Array.isArray(estilos) ? estilos : [estilos];
            filter.estilos = { $in: estilosArray };
        }

        if (authorType) {
            filter.authorType = authorType;
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'nome email tipo')
            .lean();

        const total = await Post.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.json({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    searchPosts
};
