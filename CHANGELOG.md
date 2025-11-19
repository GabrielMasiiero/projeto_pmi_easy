# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2025-11-19

### 🎉 Adicionado

#### Infraestrutura
- 🐳 Docker Compose para orquestração de containers
- 🐳 Dockerfile otimizado para a aplicação
- 📦 MongoDB containerizado com persistência de dados
- 🔧 Variáveis de ambiente configuráveis (.env.example)

#### Segurança
- 🔒 Helmet para headers de segurança HTTP
- 🛡️ Rate limiting (proteção contra brute-force)
- ✅ Express Validator para validação de entrada
- 🔐 Middleware de autenticação reutilizável
- 🚫 Proteção CSRF preparada

#### Funcionalidades
- 📸 Sistema completo de Posts (CRUD)
- ❤️ Sistema de curtidas em posts
- 💬 Sistema de comentários em posts
- 🔍 Busca avançada de tatuadores
- 🎨 Filtros por estilo, cidade e estado
- 📤 Upload de imagens (posts e avatars)
- 👤 Perfil de usuário completo
- 🎯 Sistema de tags para posts

#### Modelos
- 📊 Modelo Post completo com likes e comentários
- 👤 Modelo User expandido com bio, localização, etc
- 🎨 Suporte a múltiplos estilos de tatuagem

#### Rotas e Controllers
- 🛣️ UserRoutes: perfil, busca, atualização
- 🛣️ PostRoutes: CRUD, likes, comentários
- 🎮 Controllers organizados e documentados

#### Middlewares
- 🔐 auth.js: autenticação e autorização
- 📤 upload.js: configuração do Multer
- ✅ validation.js: validações completas

#### Views
- 🎨 Página 404 personalizada
- 🎨 Página 500 personalizada
- 🎨 Página de erro genérica

#### Documentação
- 📚 README completo com instruções Docker
- 📖 Documentação da API (docs/API.md)
- 🚀 Guia de início rápido (docs/GETTING_STARTED.md)
- 📋 Changelog

#### Desenvolvimento
- 🌱 Seed completo com dados de exemplo
- 🔄 Nodemon para hot-reload
- 📝 Scripts npm organizados

### ♻️ Modificado

#### Estrutura
- 📁 Reorganização: docs/ → src/
- 🔧 package.json atualizado com novos scripts
- 📝 .gitignore movido para raiz e expandido

#### Dependências
- ➕ helmet (^8.0.0)
- ➕ express-validator (^7.2.0)
- ➕ express-rate-limit (^7.4.1)
- ➕ multer (^1.4.5-lts.1)
- ➕ nodemon (^3.1.7)
- ➖ mysql e mysql2 removidos

#### Configuração
- ⚙️ app.js refatorado com segurança
- ⚙️ Rotas protegidas com middleware
- ⚙️ SESSION_SECRET forte gerado

### 🐛 Corrigido
- ✅ Validação de senhas no cadastro
- ✅ Tratamento de erros melhorado
- ✅ Proteção de rotas implementada
- ✅ Upload de arquivos seguro

### 🔒 Segurança
- Implementação de rate limiting
- Validação de entrada em todas as rotas
- Headers de segurança com Helmet
- Hash de senhas com bcryptjs
- Sessões persistentes no MongoDB

---

## [1.0.0] - Data Anterior

### Adicionado
- ✨ Estrutura inicial do projeto
- 🔐 Sistema de autenticação básico
- 👤 Modelo de usuário
- 🎨 Views com EJS
- 📱 Interface básica

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas
