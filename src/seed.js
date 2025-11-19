// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();

// Dados de exemplo
const usuarios = [
    {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'senha123',
        tipo: 'usuario',
        bio: 'Apaixonado por tatuagens e arte',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '11987654321'
    },
    {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        senha: 'senha123',
        tipo: 'usuario',
        bio: 'Sempre quis fazer uma tatuagem perfeita',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        telefone: '21987654321'
    }
];

const tatuadores = [
    {
        nome: 'Carlos Tattoo',
        email: 'carlos@tattoo.com',
        senha: 'senha123',
        tipo: 'tatuador',
        bio: 'Especialista em Old School e Tradicional. 15 anos de experiência.',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '11999887766',
        estilos: ['old-school', 'tradicional']
    },
    {
        nome: 'Ana Ink',
        email: 'ana@tattoo.com',
        senha: 'senha123',
        tipo: 'tatuador',
        bio: 'Apaixonada por realismo e aquarela. Cada tatuagem é uma obra de arte.',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        telefone: '21999887766',
        estilos: ['realismo', 'aquarela']
    },
    {
        nome: 'Pedro Black',
        email: 'pedro@tattoo.com',
        senha: 'senha123',
        tipo: 'tatuador',
        bio: 'Especialista em Blackwork e Geométrico. Trabalhos exclusivos.',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        telefone: '31999887766',
        estilos: ['blackwork', 'geometrico']
    },
    {
        nome: 'Juliana Art',
        email: 'juliana@tattoo.com',
        senha: 'senha123',
        tipo: 'tatuador',
        bio: 'Minimalismo e delicadeza em cada traço. Atendimento especializado.',
        cidade: 'Curitiba',
        estado: 'PR',
        telefone: '41999887766',
        estilos: ['minimalista', 'geometrico']
    },
    {
        nome: 'Roberto Samurai',
        email: 'roberto@tattoo.com',
        senha: 'senha123',
        tipo: 'tatuador',
        bio: 'Mestre em estilo Japonês. Tradição e cultura oriental.',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '11988776655',
        estilos: ['japones', 'tradicional']
    }
];

const posts = [
    {
        description: 'Dragão japonês finalizado! Cliente super satisfeito. 🐉',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['dragao', 'japones', 'oriental'],
        estilos: ['japones']
    },
    {
        description: 'Old School sempre em alta! Âncora com rosas. ⚓',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['oldschool', 'ancora', 'rosas'],
        estilos: ['old-school']
    },
    {
        description: 'Retrato realista da avó da cliente. Emocionante! 💖',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['realismo', 'retrato', 'blackgrey'],
        estilos: ['realismo']
    },
    {
        description: 'Aquarela floral delicada. Cores vibrantes! 🌸',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['aquarela', 'flores', 'colorido'],
        estilos: ['aquarela']
    },
    {
        description: 'Blackwork geométrico. Linhas perfeitas! ⚫',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['blackwork', 'geometrico', 'moderno'],
        estilos: ['blackwork', 'geometrico']
    },
    {
        description: 'Minimalista e elegante. Menos é mais! ✨',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['minimalista', 'simples', 'elegante'],
        estilos: ['minimalista']
    }
];

/**
 * Função principal de seed
 */
async function seedDatabase() {
    try {
        console.log('🌱 Iniciando seed do banco de dados...\n');

        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB\n');

        // Limpar dados existentes
        console.log('🗑️  Limpando dados existentes...');
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('✅ Dados limpos\n');

        // Criar usuários comuns
        console.log('👤 Criando usuários...');
        // Hashear senhas antes de inserir
        for (let user of usuarios) {
            const salt = await bcrypt.genSalt(10);
            user.senha = await bcrypt.hash(user.senha, salt);
        }
        const usuariosCriados = await User.insertMany(usuarios);
        console.log(`✅ ${usuariosCriados.length} usuários criados\n`);

        // Criar tatuadores
        console.log('🎨 Criando tatuadores...');
        // Hashear senhas antes de inserir
        for (let tatuador of tatuadores) {
            const salt = await bcrypt.genSalt(10);
            tatuador.senha = await bcrypt.hash(tatuador.senha, salt);
        }
        const tatuadoresCriados = await User.insertMany(tatuadores);
        console.log(`✅ ${tatuadoresCriados.length} tatuadores criados\n`);

        // Criar posts
        console.log('📸 Criando posts...');
        const postsComAutor = posts.map((post, index) => {
            const tatuador = tatuadoresCriados[index % tatuadoresCriados.length];
            return {
                ...post,
                author: tatuador._id,
                authorName: tatuador.nome,
                authorType: tatuador.tipo
            };
        });

        const postsCriados = await Post.insertMany(postsComAutor);
        console.log(`✅ ${postsCriados.length} posts criados\n`);

        // Adicionar alguns likes e comentários aleatórios
        console.log('💙 Adicionando likes e comentários...');
        for (const post of postsCriados) {
            // Adicionar likes aleatórios
            const numLikes = Math.floor(Math.random() * usuariosCriados.length);
            for (let i = 0; i < numLikes; i++) {
                const usuario = usuariosCriados[Math.floor(Math.random() * usuariosCriados.length)];
                await post.addLike(usuario._id);
            }

            // Adicionar comentários aleatórios
            const numComments = Math.floor(Math.random() * 3);
            const comentarios = [
                'Trabalho incrível!',
                'Ficou perfeito! 🔥',
                'Quanto tempo levou?',
                'Amei o resultado!',
                'Que talento! 👏',
                'Preciso fazer uma igual!'
            ];

            for (let i = 0; i < numComments; i++) {
                const usuario = usuariosCriados[Math.floor(Math.random() * usuariosCriados.length)];
                const comentario = comentarios[Math.floor(Math.random() * comentarios.length)];
                await post.addComment(usuario._id, usuario.nome, comentario);
            }
        }
        console.log('✅ Likes e comentários adicionados\n');

        // Exibir resumo
        console.log('═══════════════════════════════════');
        console.log('📊 RESUMO DO SEED');
        console.log('═══════════════════════════════════');
        console.log(`👤 Usuários: ${usuariosCriados.length}`);
        console.log(`🎨 Tatuadores: ${tatuadoresCriados.length}`);
        console.log(`📸 Posts: ${postsCriados.length}`);
        console.log('═══════════════════════════════════\n');

        console.log('🎉 Seed concluído com sucesso!\n');
        console.log('📝 Credenciais de teste:');
        console.log('   Usuário: joao@example.com / senha123');
        console.log('   Tatuador: carlos@tattoo.com / senha123');
        console.log('   Tatuador: ana@tattoo.com / senha123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        process.exit(1);
    }
}

// Executar seed
seedDatabase();
