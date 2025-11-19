// controllers/authController.js
const User = require('../models/User');

/**
 * Renderiza a página de login
 */
const renderLogin = (req, res) => {
    res.render('login', { errorMessage: null });
};

// POST /login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', { errorMessage: 'Preencha email e senha.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).render('login', { errorMessage: 'Email ou senha incorretos.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).render('login', { errorMessage: 'Email ou senha incorretos.' });
        }

        // salva dados do usuário na sessão
        req.session.user = {
            id: user._id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo,
        };

        console.log(`✅ Login bem-sucedido: ${user.email}`);
        return res.redirect('/feed');
    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).render('login', { errorMessage: 'Erro interno no servidor.' });
    }
};

// POST /cadastro
const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).render('login', { errorMessage: 'Preencha todos os campos.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('login', { errorMessage: 'As senhas não coincidem.' });
        }

        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { nome: username }] });
        if (existingUser) {
            return res.status(400).render('login', { errorMessage: 'Usuário ou e-mail já registrado.' });
        }

        const newUser = new User({
            nome: username,
            email: email.toLowerCase(),
            senha: password, // será hasheada no pre-save do model
            tipo: role || 'usuario',
        });

        await newUser.save();
        console.log('✅ Usuário cadastrado:', newUser.email);
        return res.redirect('/login');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).render('login', { errorMessage: 'Erro interno no servidor.' });
    }
};

// GET /logout
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Erro ao destruir sessão:', err);
        res.redirect('/login');
    });
};

module.exports = { renderLogin, login, register, logout };
