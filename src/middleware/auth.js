// middleware/auth.js
/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado antes de acessar rotas protegidas
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/login');
};

/**
 * Middleware para verificar se o usuário é tatuador
 */
const isTatuador = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.tipo === 'tatuador') {
        return next();
    }
    return res.status(403).render('error', {
        message: 'Acesso negado. Apenas tatuadores podem acessar esta página.',
        statusCode: 403
    });
};

/**
 * Middleware para verificar se o usuário é comum
 */
const isUsuario = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.tipo === 'usuario') {
        return next();
    }
    return res.status(403).render('error', {
        message: 'Acesso negado. Apenas usuários comuns podem acessar esta página.',
        statusCode: 403
    });
};

/**
 * Middleware para redirecionar se já estiver autenticado
 */
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/feed');
    }
    next();
};

module.exports = {
    isAuthenticated,
    isTatuador,
    isUsuario,
    redirectIfAuthenticated
};
