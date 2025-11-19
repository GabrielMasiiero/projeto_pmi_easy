# 🚀 Guia de Deploy em Produção

Este guia fornece orientações para colocar o Easy Tattoo em produção.

## 📋 Checklist Pré-Deploy

### Segurança

- [ ] `SESSION_SECRET` forte e único gerado
- [ ] Senhas e credenciais não commitadas
- [ ] `.env` não está no Git
- [ ] Rate limiting configurado adequadamente
- [ ] CORS configurado se necessário
- [ ] HTTPS configurado
- [ ] Helmet configurado corretamente

### Banco de Dados

- [ ] MongoDB Atlas configurado (ou similar)
- [ ] Backup automatizado configurado
- [ ] Índices criados para performance
- [ ] Conexão segura (SSL/TLS)
- [ ] Credenciais fortes

### Performance

- [ ] Compressão habilitada
- [ ] Cache configurado (Redis recomendado)
- [ ] CDN para arquivos estáticos (opcional)
- [ ] Logs configurados
- [ ] Monitoramento configurado

### Código

- [ ] Variáveis de ambiente configuradas
- [ ] `NODE_ENV=production`
- [ ] Dependências atualizadas
- [ ] Vulnerabilidades verificadas (`npm audit`)
- [ ] Build otimizado

---

## 🌐 Opções de Hospedagem

### 1. Railway (Recomendado para Início)

**Vantagens:**
- ✅ Gratuito para projetos pequenos
- ✅ Deploy automático com Git
- ✅ MongoDB integrado
- ✅ HTTPS automático

**Passos:**

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Iniciar projeto
railway init

# 4. Adicionar MongoDB
railway add mongodb

# 5. Deploy
railway up
```

### 2. Heroku

**Vantagens:**
- ✅ Popular e bem documentado
- ✅ Dyno gratuito disponível
- ✅ Add-ons para MongoDB

**Passos:**

```bash
# 1. Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Criar app
heroku create easy-tattoo

# 4. Adicionar MongoDB
heroku addons:create mongolab:sandbox

# 5. Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=sua_chave_secreta

# 6. Deploy
git push heroku main
```

### 3. Render

**Vantagens:**
- ✅ Gratuito para web services
- ✅ Deploy automático
- ✅ Banco de dados PostgreSQL/MongoDB

**Passos:**

1. Criar conta em https://render.com
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

### 4. DigitalOcean / AWS / Google Cloud

**Vantagens:**
- ✅ Controle total
- ✅ Escalável
- ✅ Melhor performance

**Requer:**
- Conhecimento de DevOps
- Configuração manual
- Custos mais altos

---

## 🔧 Configurações de Produção

### Variáveis de Ambiente

Crie um arquivo `.env.production`:

```env
# Servidor
NODE_ENV=production
PORT=3000

# MongoDB Atlas (exemplo)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/EasyTattoDB?retryWrites=true&w=majority

# Sessão (GERE UMA NOVA!)
SESSION_SECRET=GERE_UMA_CHAVE_SUPER_SECRETA_AQUI

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app

# URLs
BASE_URL=https://seu-dominio.com
```

### Gerar SESSION_SECRET

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### package.json para Produção

Adicione scripts de produção:

```json
{
  "scripts": {
    "start": "NODE_ENV=production node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node src/seed.js",
    "seed:prod": "NODE_ENV=production node src/seed.js",
    "logs": "pm2 logs",
    "restart": "pm2 restart all"
  },
  "engines": {
    "node": "20.x",
    "npm": "10.x"
  }
}
```

---

## 🔐 MongoDB Atlas Setup

### 1. Criar Cluster

1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um novo cluster (M0 Free)
4. Configure Network Access (0.0.0.0/0 para qualquer IP)

### 2. Criar Usuário

1. Database Access → Add New User
2. Escolha autenticação por senha
3. Defina permissões (readWrite)

### 3. Obter Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/EasyTattoDB?retryWrites=true&w=majority
```

Substitua:
- `username` - Seu usuário
- `password` - Sua senha
- `cluster` - Seu cluster

### 4. Configurar Índices

```javascript
// Executar no MongoDB Compass ou mongosh
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ author: 1, createdAt: -1 });
db.posts.createIndex({ tags: 1 });
db.posts.createIndex({ estilos: 1 });
```

---

## 📊 Monitoramento

### PM2 (Recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start src/app.js --name "easy-tattoo"

# Ver logs
pm2 logs

# Monitorar
pm2 monit

# Restart automático
pm2 startup
pm2 save
```

### Configurar ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'easy-tattoo',
    script: './src/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### Sentry (Monitoramento de Erros)

```bash
npm install @sentry/node
```

```javascript
// No início do app.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV
});
```

---

## 🔒 Configurações de Segurança Adicionais

### HTTPS com Let's Encrypt

Se usar servidor próprio (VPS):

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```

### Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Firewall (UFW)

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 📈 Performance

### Compressão

```javascript
const compression = require('compression');
app.use(compression());
```

### Cache com Redis

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

// Exemplo de cache
app.get('/posts', async (req, res) => {
    const cacheKey = 'posts:all';
    
    // Tentar buscar do cache
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    // Buscar do banco
    const posts = await Post.find();
    
    // Salvar no cache (5 minutos)
    await client.setEx(cacheKey, 300, JSON.stringify(posts));
    
    res.json(posts);
});
```

---

## 🧪 Testes em Produção

```bash
# Testar conexão
curl https://seu-dominio.com/

# Testar API
curl https://seu-dominio.com/posts

# Verificar headers de segurança
curl -I https://seu-dominio.com/
```

---

## 📝 Checklist Pós-Deploy

- [ ] Aplicação está rodando
- [ ] HTTPS funcionando
- [ ] Banco de dados conectado
- [ ] Uploads funcionando
- [ ] Emails funcionando (se configurado)
- [ ] Logs sendo gravados
- [ ] Monitoramento ativo
- [ ] Backup funcionando
- [ ] Performance aceitável
- [ ] Testar todas as funcionalidades críticas

---

## 🆘 Troubleshooting

### App não inicia

```bash
# Verificar logs
pm2 logs

# Verificar variáveis de ambiente
pm2 env 0

# Verificar porta
lsof -i :3000
```

### Erro de conexão MongoDB

```bash
# Testar conexão
mongosh "sua_connection_string"

# Verificar IP whitelist no MongoDB Atlas
# Verificar credenciais
```

### Upload não funciona

```bash
# Verificar permissões
ls -la uploads/

# Ajustar permissões
chmod -R 755 uploads/
```

---

## 📚 Recursos Úteis

- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

## 🎉 Sucesso!

Parabéns! Seu Easy Tattoo está em produção! 🚀

Não esqueça de:
- Monitorar regularmente
- Fazer backups
- Atualizar dependências
- Responder a issues
- Coletar feedback dos usuários
