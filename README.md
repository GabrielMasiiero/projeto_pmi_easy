# 🎨 Easy Tattoo

> Plataforma para conectar tatuadores e clientes de forma simples e eficiente

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Sobre o Projeto

**Easy Tattoo** é uma plataforma multilateral que resolve o problema: _"Quero me tatuar mas não sei com quem."_

### 🎯 Proposta de Valor
Conectar clientes com tatuadores de forma revolucionária, oferecendo:
- 🔍 Busca personalizada de tatuadores por estilo e localização
- 📸 Portfólio visual de trabalhos
- 💬 Sistema de avaliações e comentários
- 📱 Interface moderna e intuitiva

### 👥 Equipe
Martin, Bhernardo, Eduardo Marthendal, Gabriel Masiero, Giovane Machado

---

## 🚀 Tecnologias

- **Backend:** Node.js + Express.js
- **Banco de Dados:** MongoDB + Mongoose
- **Template Engine:** EJS
- **Autenticação:** Express Session + bcryptjs
- **Upload:** Multer
- **Segurança:** Helmet, Express Rate Limit, Express Validator
- **Containerização:** Docker + Docker Compose

---

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+ 
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

### Método 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/GabrielMasiiero/projeto_pmi_easy.git
cd projeto_pmi_easy

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker-compose up -d

# Popular o banco com dados de teste (IMPORTANTE!)
docker-compose exec app npm run seed

# Acesse a aplicação
# http://localhost:3000
```

### 🔑 Credenciais de Acesso

Após executar o seed, use estas credenciais para fazer login:

**Usuário Comum:**
- Email: `joao@example.com`
- Senha: `senha123`

**Tatuador:**
- Email: `carlos@tattoo.com`
- Senha: `senha123`

> 📝 **Mais credenciais?** Veja o arquivo [CREDENTIALS.md](CREDENTIALS.md) para lista completa de usuários disponíveis!

### Método 2: Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/GabrielMasiiero/projeto_pmi_easy.git
cd projeto_pmi_easy

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o MongoDB localmente ou use Docker:
docker-compose up -d mongodb

# Execute a aplicação
npm start

# Ou em modo desenvolvimento:
npm run dev
```

---

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar apenas o MongoDB
docker-compose up -d mongodb

# Iniciar em modo desenvolvimento (com nodemon)
docker-compose --profile dev up app-dev

# Ver logs
docker-compose logs -f app

# Parar os serviços
docker-compose down

# Parar e remover volumes (dados)
docker-compose down -v

# Rebuildar as imagens
docker-compose build --no-cache
```

### Estrutura Docker

- **mongodb**: Banco de dados MongoDB 7.0 (porta 27017)
- **app**: Aplicação em produção (porta 3000)
- **app-dev**: Aplicação em desenvolvimento com hot-reload (porta 3001)

---

## 📂 Estrutura do Projeto

```
projeto_pmi_easy/
├── src/
│   ├── config/
│   │   └── db.js              # Configuração MongoDB
│   ├── controllers/
│   │   └── authController.js  # Lógica de autenticação
│   ├── middleware/
│   │   ├── auth.js            # Middleware de autenticação
│   │   ├── upload.js          # Configuração Multer
│   │   └── validation.js      # Validações
│   ├── models/
│   │   ├── User.js            # Modelo de usuário
│   │   └── Post.js            # Modelo de posts
│   ├── routes/
│   │   ├── authRoutes.js      # Rotas de autenticação
│   │   └── userRoutes.js      # Rotas de usuário
│   ├── views/                 # Templates EJS
│   ├── public/                # Arquivos estáticos
│   ├── app.js                 # Aplicação principal
│   └── seed.js                # Seed de dados
├── uploads/                   # Uploads de imagens
├── .env                       # Variáveis de ambiente
├── .env.example               # Exemplo de variáveis
├── docker-compose.yml         # Configuração Docker
├── Dockerfile                 # Imagem da aplicação
└── package.json               # Dependências
```

---

## ⚙️ Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://admin:admin123@localhost:27017/EasyTattoDB?authSource=admin

# Sessão
SESSION_SECRET=sua-chave-secreta-aqui

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

**⚠️ Importante:** Gere uma `SESSION_SECRET` forte para produção:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎮 Scripts Disponíveis

```bash
npm start          # Inicia a aplicação
npm run dev        # Inicia com nodemon (hot-reload)
npm run seed       # Popula o banco com dados de exemplo
npm test           # Executa os testes
```

---

## 📡 API Endpoints

### Autenticação

```http
GET  /login              # Página de login
POST /login              # Realizar login
POST /cadastro           # Criar conta
GET  /logout             # Fazer logout
```

### Usuário

```http
GET  /feed               # Feed de posts
GET  /perfil             # Perfil do usuário logado
GET  /perfilUsuario      # Perfil de outro usuário
GET  /config             # Configurações
```

### Posts

```http
GET    /posts            # Listar posts
POST   /posts            # Criar post
GET    /posts/:id        # Ver post específico
PUT    /posts/:id        # Atualizar post
DELETE /posts/:id        # Deletar post
POST   /posts/:id/like   # Curtir post
```

### Busca

```http
GET  /busca              # Buscar tatuadores
GET  /busca/filtros      # Busca com filtros
```

---

## 🔒 Segurança

O projeto implementa várias camadas de segurança:

- ✅ Helmet - Headers de segurança HTTP
- ✅ Rate Limiting - Proteção contra brute-force
- ✅ Express Validator - Validação de entrada
- ✅ Bcrypt - Hash de senhas
- ✅ Session Store - Sessões persistentes no MongoDB
- ✅ CSRF Protection - Proteção contra CSRF
- ✅ File Upload Validation - Validação de arquivos

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

---

## 🌐 Links do Projeto

- 🔗 **GitHub:** https://github.com/GabrielMasiiero/projeto_pmi_easy
- 🛬 **Landing Page:** https://gabrielmasiiero.github.io/projeto-easy-tattoo/
- ⌨️ **Protótipo Figma:** https://www.figma.com/design/37kRr9A8zKFgpt0yxGk552/ProjetoFigma
- 📊 **Sumário de Implementações:** [docs/SUMMARY.md](docs/SUMMARY.md)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

Equipe Easy Tattoo - [GitHub](https://github.com/GabrielMasiiero)

**Projeto desenvolvido como parte do PMI (Projeto Multidisciplinar Integrado)**





