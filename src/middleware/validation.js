// middleware/validation.js
const { body, validationResult } = require('express-validator');

/**
 * Middleware para processar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        console.log('❌ Erros de validação:', errorMessages);

        // Se for uma requisição AJAX/API
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(400).json({ errors: errorMessages });
        }

        // Se for uma requisição web normal, verificar a rota
        const path = req.path;

        // Para rotas de post, renderizar página de criar post
        if (path.includes('/posts')) {
            return res.status(400).render('criar-post', { errorMessage: errorMessages[0] });
        }

        // Para rotas de auth, renderizar login
        return res.status(400).render('login', { errorMessage: errorMessages[0] });
    }
    next();
};

/**
 * Validações para cadastro
 */
const validateRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres')
        .isLength({ max: 50 }).withMessage('Nome deve ter no máximo 50 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Senha é obrigatória')
        .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirmação de senha é obrigatória')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('As senhas não coincidem');
            }
            return true;
        }),

    body('role')
        .optional()
        .isIn(['usuario', 'tatuador']).withMessage('Tipo de usuário inválido'),

    handleValidationErrors
];

/**
 * Validações para login
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Senha é obrigatória'),

    handleValidationErrors
];

/**
 * Validações para criação de post
 */
const validatePost = [
    body('description')
        .trim()
        .notEmpty().withMessage('Descrição é obrigatória')
        .isLength({ min: 3 }).withMessage('Descrição deve ter no mínimo 3 caracteres')
        .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),

    body('tags')
        .optional()
        .customSanitizer(value => {
            // Se for string, converte para array separando por vírgula
            if (typeof value === 'string') {
                return value.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            // Se já for array, retorna como está
            if (Array.isArray(value)) {
                return value;
            }
            // Se for vazio, retorna array vazio
            return [];
        }),

    handleValidationErrors
];

/**
 * Validações para atualização de perfil
 */
const validateProfileUpdate = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres')
        .isLength({ max: 50 }).withMessage('Nome deve ter no máximo 50 caracteres'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Bio deve ter no máximo 500 caracteres'),

    body('telefone')
        .optional()
        .trim()
        .matches(/^[0-9]{10,11}$/).withMessage('Telefone inválido'),

    body('cidade')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Cidade deve ter no máximo 100 caracteres'),

    body('estado')
        .optional()
        .trim()
        .isLength({ max: 2 }).withMessage('Estado deve ter 2 caracteres'),

    handleValidationErrors
];

/**
 * Validações para busca
 */
const validateSearch = [
    body('query')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Busca deve ter no mínimo 2 caracteres'),

    body('cidade')
        .optional()
        .trim(),

    body('estado')
        .optional()
        .trim()
        .isLength({ max: 2 }).withMessage('Estado inválido'),

    body('estilos')
        .optional()
        .isArray().withMessage('Estilos devem ser um array'),

    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validatePost,
    validateProfileUpdate,
    validateSearch,
    handleValidationErrors
};
