// seed-more-posts.js - Adiciona 15 novos posts ao banco
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Post = require('./src/models/Post');

dotenv.config();

const novosPosts = [
    {
        description: 'Dragão chinês nas costas completo! Projeto de 6 sessões finalizado. Cliente emocionado com o resultado! 🐉',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['dragao', 'oriental', 'costas', 'grande'],
        estilos: ['japones', 'tradicional']
    },
    {
        description: 'Rosa realista em preto e cinza. Sombreamento perfeito! 🌹',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['rosa', 'flores', 'realista', 'blackgrey'],
        estilos: ['realismo']
    },
    {
        description: 'Mandala geométrica no antebraço. Simetria impecável! ✨',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['mandala', 'geometrico', 'antebraco', 'simetria'],
        estilos: ['geometrico', 'blackwork']
    },
    {
        description: 'Leão rugindo em Old School tradicional. Cores vibrantes! 🦁',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['leao', 'oldschool', 'colorido', 'animal'],
        estilos: ['old-school', 'tradicional']
    },
    {
        description: 'Flor de lótus em aquarela delicada. Cores suaves e transições perfeitas! 🌸',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['lotus', 'flores', 'aquarela', 'delicada'],
        estilos: ['aquarela']
    },
    {
        description: 'Caveira mexicana colorida! Dia de Los Muertos style 💀',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['caveira', 'mexicana', 'colorido', 'tradicional'],
        estilos: ['tradicional', 'outro']
    },
    {
        description: 'Lobo uivando para lua cheia. Realismo perfeito! 🐺',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['lobo', 'lua', 'realismo', 'animal'],
        estilos: ['realismo']
    },
    {
        description: 'Triângulos geométricos minimalistas. Menos é mais! △',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['minimalista', 'geometrico', 'triangulos', 'simples'],
        estilos: ['minimalista', 'geometrico']
    },
    {
        description: 'Carpa Koi subindo a correnteza! Cores incríveis 🐟',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['koi', 'japones', 'peixe', 'agua'],
        estilos: ['japones', 'tradicional']
    },
    {
        description: 'Phoenix renascendo das cinzas em blackwork! Obra de arte pura! 🔥',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['phoenix', 'blackwork', 'mitologia', 'grande'],
        estilos: ['blackwork']
    },
    {
        description: 'Borboleta aquarela com traços delicados. Feminina e elegante! 🦋',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['borboleta', 'aquarela', 'feminina', 'delicada'],
        estilos: ['aquarela', 'minimalista']
    },
    {
        description: 'Âncora old school com corda. Tradicional puro! ⚓',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['ancora', 'oldschool', 'nautica', 'tradicional'],
        estilos: ['old-school', 'tradicional']
    },
    {
        description: 'Coruja realista com penas detalhadas. Olhar penetrante! 🦉',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['coruja', 'realismo', 'ave', 'detalhes'],
        estilos: ['realismo']
    },
    {
        description: 'Padrões tribais polinésios no ombro. Cultura e tradição! 🗿',
        imageUrl: '/img/tattoo2.jpg',
        tags: ['tribal', 'polinesio', 'ombro', 'tradicao'],
        estilos: ['tribal']
    },
    {
        description: 'Gueixa japonesa com guarda-chuva e flores de cerejeira. Arte oriental completa! 🌸',
        imageUrl: '/img/tattoo1.jpg',
        tags: ['gueixa', 'japones', 'oriental', 'flores'],
        estilos: ['japones', 'tradicional']
    }
];

async function seedMorePosts() {
    try {
        console.log('🌱 Adicionando mais posts ao banco...\n');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado ao MongoDB\n');

        // Buscar todos os tatuadores
        const tatuadores = await User.find({ tipo: 'tatuador' });

        if (tatuadores.length === 0) {
            console.log('❌ Nenhum tatuador encontrado!');
            process.exit(1);
        }

        console.log(`✅ ${tatuadores.length} tatuadores encontrados\n`);

        // Distribuir posts entre os tatuadores
        const postsParaCriar = novosPosts.map((postData, index) => {
            const tatuador = tatuadores[index % tatuadores.length];
            return {
                ...postData,
                author: tatuador._id,
                authorName: tatuador.nome,
                authorType: tatuador.tipo
            };
        });

        // Criar posts
        console.log('📸 Criando novos posts...');
        const postsCriados = await Post.insertMany(postsParaCriar);
        console.log(`✅ ${postsCriados.length} posts criados\n`);

        // Adicionar alguns likes e comentários aleatórios
        console.log('💙 Adicionando likes e comentários...');
        const usuarios = await User.find();

        for (const post of postsCriados) {
            // Adicionar likes aleatórios
            const numLikes = Math.floor(Math.random() * usuarios.length);
            for (let i = 0; i < numLikes; i++) {
                const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
                await post.addLike(usuario._id);
            }

            // Adicionar comentários aleatórios
            const numComments = Math.floor(Math.random() * 4);
            const comentarios = [
                'Trabalho incrível!',
                'Ficou perfeito! 🔥',
                'Quanto tempo levou?',
                'Quero fazer uma igual!',
                'Que talento! 👏',
                'Top demais!',
                'Obra de arte! ❤️',
                'Sombreamento perfeito!'
            ];

            for (let i = 0; i < numComments; i++) {
                const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
                const comentario = comentarios[Math.floor(Math.random() * comentarios.length)];
                await post.addComment(usuario._id, usuario.nome, comentario);
            }
        }
        console.log('✅ Likes e comentários adicionados\n');

        // Estatísticas finais
        const totalPosts = await Post.countDocuments();
        const totalLikes = await Post.aggregate([
            { $group: { _id: null, total: { $sum: '$likesCount' } } }
        ]);

        console.log('═══════════════════════════════════');
        console.log('📊 ESTATÍSTICAS FINAIS');
        console.log('═══════════════════════════════════');
        console.log(`📸 Total de Posts: ${totalPosts}`);
        console.log(`💙 Total de Likes: ${totalLikes[0]?.total || 0}`);
        console.log(`🎨 Tatuadores: ${tatuadores.length}`);
        console.log('═══════════════════════════════════\n');

        console.log('🎉 Novos posts adicionados com sucesso!\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao adicionar posts:', error);
        process.exit(1);
    }
}

seedMorePosts();
