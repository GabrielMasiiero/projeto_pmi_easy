// app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middleware/auth');
// const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// View engine e pasta views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Segurança com Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate Limiting - Proteção contra brute-force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo de 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 20, // máximo de 20 tentativas de login (aumentado para desenvolvimento)
    message: 'Muitas tentativas de login. Tente novamente em 5 minutos.',
    skipSuccessfulRequests: true,
});

app.use(limiter);
app.use('/login', authLimiter);
app.use('/cadastro', authLimiter);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessão (usa MongoStore se MONGO_URI definido)
const sessionStore = process.env.MONGO_URI
    ? MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: 'sessions' })
    : null;

app.use(session({
    secret: process.env.SESSION_SECRET || 'troque-essa-chave',
    resave: false,
    saveUninitialized: false,
    store: sessionStore || undefined,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));

// middleware para injetar user nas views (se quiser mostrar nome)
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Rotas
app.use('/', authRoutes);

// Importar e usar rotas de usuário e posts
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/user', userRoutes);
app.use('/posts', postRoutes);

// Rotas principais
app.get('/', (req, res) => res.redirect('/login'));
app.get('/sobre', (req, res) => res.render('index'));

// Redireciona /feed para /posts (controller real)
app.get('/feed', isAuthenticated, (req, res) => res.redirect('/posts'));

// Redireciona /perfil para /user/perfil
app.get('/perfil', isAuthenticated, (req, res) => res.redirect('/user/perfil'));

// Página de configurações
app.get('/config', isAuthenticated, (req, res) => {
    res.render('configuracoes', { user: req.session.user });
});

// 404
app.use((req, res) => res.status(404).render('404', { message: 'Página não encontrada!' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500', { message: 'Erro interno no servidor!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
