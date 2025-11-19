// test-login.js - Script para testar login manualmente
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function testLogin() {
    try {
        console.log('🔍 Conectando ao MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado!\n');

        const email = 'joao@example.com';
        const senha = 'senha123';

        console.log(`🔍 Buscando usuário: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('❌ Usuário não encontrado!');
            process.exit(1);
        }

        console.log(`✅ Usuário encontrado: ${user.nome}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔐 Hash da senha: ${user.senha.substring(0, 20)}...`);
        console.log(`🎭 Tipo: ${user.tipo}\n`);

        console.log(`🔍 Testando senha: "${senha}"`);
        const isMatch = await user.comparePassword(senha);
        
        if (isMatch) {
            console.log('✅ SENHA CORRETA! Login funcionaria.');
        } else {
            console.log('❌ SENHA INCORRETA! Login falharia.');
            
            // Testa hash manualmente
            console.log('\n🔍 Testando hash manualmente...');
            const manualMatch = await bcrypt.compare(senha, user.senha);
            console.log(`Resultado manual: ${manualMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

testLogin();
