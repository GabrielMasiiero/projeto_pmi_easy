// app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // opcional — melhora persistência de sessão
const connectDB = require('./config/db'); // seu connectDB (já usa process.env)
const authRoutes = require('./routes/authRoutes');
// se quiser, importe outras routes: const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// View engine e pasta views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
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
// se tiver: app.use('/user', userRoutes);

// rotas principais
app.get('/', (req, res) => res.redirect('/login'));
app.get('/sobre', (req, res) => res.render('index'));
app.get('/perfil', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('perfil');
});
app.get('/perfilUsuario', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('perfilUsuario');
});
app.get('/config', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('configuracoes');
});
app.get('/feed', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const posts = [
        { imageUrl: '/img/tattoo1.jpg', artistName: 'Artista 1', description: 'Tatuagem Old School', likes: 120, comments: 45 },
        { imageUrl: '/img/tattoo2.jpg', artistName: 'Artista 2', description: 'Flashs disponíveis', likes: 98, comments: 34 },
    ];
    return res.render('feed', { posts });
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
