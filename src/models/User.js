// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // usar bcryptjs (sem build nativo)

// Definição do Schema do Usuário
const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ['usuario', 'tatuador'], required: true },
    bio: { type: String, maxlength: 500 },
    telefone: { type: String },
    cidade: { type: String },
    estado: { type: String, maxlength: 2 },
    avatar: { type: String, default: '/img/default-avatar.png' },
    estilos: [{
        type: String,
        enum: [
            'old-school',
            'realismo',
            'blackwork',
            'aquarela',
            'minimalista',
            'geometrico',
            'tribal',
            'japones',
            'tradicional',
            'outro'
        ]
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Middleware para hashear a senha antes de salvar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', UserSchema);