// controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

/**
 * Obter perfil do usuário logado
 */
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).select('-senha');

        if (!user) {
            return res.status(404).render('404', { message: 'Usuário não encontrado' });
        }

        const posts = await Post.find({ author: user._id, isActive: true })
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('perfil', { user, posts });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).render('500', { message: 'Erro ao carregar perfil' });
    }
};

/**
 * Obter perfil de outro usuário
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');

        if (!user) {
            return res.status(404).render('404', { message: 'Usuário não encontrado' });
        }

        const posts = await Post.find({ author: user._id, isActive: true })
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('perfilUsuario', { user, posts });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).render('500', { message: 'Erro ao carregar perfil' });
    }
};

/**
 * Atualizar perfil
 */
const updateProfile = async (req, res) => {
    try {
        const { nome, bio, telefone, cidade, estado, estilos } = req.body;

        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualizar campos
        if (nome) user.nome = nome;
        if (bio !== undefined) user.bio = bio;
        if (telefone) user.telefone = telefone;
        if (cidade) user.cidade = cidade;
        if (estado) user.estado = estado;
        if (estilos) user.estilos = Array.isArray(estilos) ? estilos : [estilos];

        // Avatar removido - usando apenas iniciais do nome

        await user.save();

        // Atualizar sessão
        req.session.user.nome = user.nome;

        res.json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                nome: user.nome,
                bio: user.bio,
                telefone: user.telefone,
                cidade: user.cidade,
                estado: user.estado
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};

/**
 * Buscar tatuadores
 */
const searchTatuadores = async (req, res) => {
    try {
        const { query, cidade, estado, estilos } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let filter = { tipo: 'tatuador' };

        if (query) {
            filter.$or = [
                { nome: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ];
        }

        if (cidade) {
            filter.cidade = { $regex: cidade, $options: 'i' };
        }

        if (estado) {
            filter.estado = estado.toUpperCase();
        }

        if (estilos) {
            const estilosArray = Array.isArray(estilos) ? estilos : [estilos];
            filter.estilos = { $in: estilosArray };
        }

        const tatuadores = await User.find(filter)
            .select('-senha')
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        // Se for requisição API
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                tatuadores,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalTatuadores: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        }

        res.render('busca-tatuadores', {
            tatuadores,
            currentPage: page,
            totalPages,
            query: query || '',
            cidade: cidade || '',
            estado: estado || '',
            estilos: estilos || ''
        });
    } catch (error) {
        console.error('Erro ao buscar tatuadores:', error);
        res.status(500).render('500', { message: 'Erro ao buscar tatuadores' });
    }
};

/**
 * Deletar conta
 */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Remover avatar
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '../..', user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // Desativar todos os posts do usuário
        await Post.updateMany(
            { author: userId },
            { isActive: false }
        );

        // Deletar usuário
        await User.findByIdAndDelete(userId);

        // Destruir sessão
        req.session.destroy();

        res.json({ message: 'Conta deletada com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({ error: 'Erro ao deletar conta' });
    }
};

module.exports = {
    getMyProfile,
    getUserProfile,
    updateProfile,
    searchTatuadores,
    deleteAccount
};
