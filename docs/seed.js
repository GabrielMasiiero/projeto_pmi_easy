// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/EasyTattoDB';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB para popular dados!'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        process.exit(1);
    });

async function seedDatabase() {
    try {
        await User.deleteMany({});
        console.log('Coleção de usuários limpa.');

        const users = [
            { nome: 'Alice', email: 'alice@example.com', senha: await bcrypt.hash('123456', 10), tipo: 'usuario' },
            { nome: 'Bob', email: 'bob@example.com', senha: await bcrypt.hash('senhaSegura', 10), tipo: 'tatuador' },
        ];

        const inserted = await User.insertMany(users);
        console.log('Usuários populados com sucesso:', inserted);
    } catch (error) {
        console.error('Erro ao popular o banco:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('Conexão com o MongoDB encerrada.');
    }
}

seedDatabase();
