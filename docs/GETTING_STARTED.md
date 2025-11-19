# 🚀 Guia de Início Rápido - Easy Tattoo

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/get-started) e Docker Compose
- [Git](https://git-scm.com/)

## 🎬 Iniciando o Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/GabrielMasiiero/projeto_pmi_easy.git
cd projeto_pmi_easy
```

### 2. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

> ⚠️ **Importante**: O arquivo `.env` já vem configurado para desenvolvimento com Docker. Não precisa alterar nada para começar!

### 3. Inicie os Containers

```bash
docker-compose up -d
```

Este comando irá:
- ✅ Criar e iniciar o container do MongoDB
- ✅ Criar e iniciar o container da aplicação Node.js
- ✅ Configurar a rede entre os containers
- ✅ Criar volumes para persistência de dados

### 4. Aguarde os Serviços Iniciarem

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f app
```

### 5. Popular o Banco de Dados (Opcional)

```bash
# Executar seed dentro do container
docker-compose exec app npm run seed
```

Ou se estiver rodando localmente sem Docker:

```bash
npm run seed
```

### 6. Acesse a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

## 👤 Credenciais de Teste

Após executar o seed, você pode fazer login com:

**Usuário Comum:**
- Email: `joao@example.com`
- Senha: `senha123`

**Tatuadores:**
- Email: `carlos@tattoo.com` | Senha: `senha123`
- Email: `ana@tattoo.com` | Senha: `senha123`
- Email: `pedro@tattoo.com` | Senha: `senha123`

## 🛠️ Comandos Úteis

### Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart app

# Rebuildar as imagens
docker-compose build --no-cache

# Parar e remover volumes (⚠️ apaga dados do banco)
docker-compose down -v
```

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (com hot-reload)
docker-compose --profile dev up app-dev

# Ou localmente:
npm run dev

# Executar seed
npm run seed

# Iniciar aplicação
npm start
```

### MongoDB

```bash
# Acessar o MongoDB via terminal
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Dentro do mongosh:
use EasyTattoDB
db.users.find()
db.posts.find()
```

## 📂 Estrutura de Diretórios

```
projeto_pmi_easy/
├── src/
│   ├── config/          # Configurações (DB, etc)
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middlewares (auth, upload, validation)
│   ├── models/          # Modelos Mongoose
│   ├── routes/          # Rotas da aplicação
│   ├── views/           # Templates EJS
│   ├── public/          # Arquivos estáticos (CSS, JS, imagens)
│   ├── app.js           # Aplicação principal
│   └── seed.js          # Seed de dados
├── uploads/             # Uploads de usuários
├── docs/                # Documentação
├── .env                 # Variáveis de ambiente
├── docker-compose.yml   # Configuração Docker Compose
├── Dockerfile           # Imagem Docker da app
└── package.json         # Dependências npm
```

## 🔧 Desenvolvimento Local (Sem Docker)

Se preferir rodar sem Docker:

### 1. Instale o MongoDB

Baixe e instale: https://www.mongodb.com/try/download/community

### 2. Inicie o MongoDB

```bash
mongod --dbpath /path/to/data/db
```

### 3. Configure o .env

```env
MONGO_URI=mongodb://localhost:27017/EasyTattoDB
```

### 4. Instale as Dependências

```bash
npm install
```

### 5. Execute o Seed (Opcional)

```bash
npm run seed
```

### 6. Inicie a Aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## 🐛 Resolução de Problemas

### Porta 3000 já em uso

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou altere a porta no .env
PORT=3001
```

### MongoDB não conecta

```bash
# Verifique se o container está rodando
docker-compose ps

# Reinicie o MongoDB
docker-compose restart mongodb

# Veja os logs
docker-compose logs mongodb
```

### Erro de permissão em uploads/

```bash
# Linux/Mac
sudo chmod -R 777 uploads/

# Ou ajuste o proprietário
sudo chown -R $USER:$USER uploads/
```

### Rebuildar completamente

```bash
# Parar tudo e remover volumes
docker-compose down -v

# Remover imagens
docker-compose rm -f

# Rebuildar e iniciar
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Próximos Passos

1. ✅ Explore a aplicação
2. ✅ Leia a [Documentação da API](docs/API.md)
3. ✅ Customize os estilos em `src/public/css/`
4. ✅ Adicione novas funcionalidades
5. ✅ Execute os testes (quando implementados)

## 🆘 Precisa de Ajuda?

- 📖 [README Principal](README.md)
- 📚 [Documentação da API](docs/API.md)
- 🐛 [Issues no GitHub](https://github.com/GabrielMasiiero/projeto_pmi_easy/issues)

## 🎉 Pronto!

Agora você está pronto para desenvolver no Easy Tattoo! 🎨

Explore, experimente e divirta-se codificando! 🚀
