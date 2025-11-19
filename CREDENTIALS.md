# 👤 CREDENCIAIS DE ACESSO - Easy Tattoo

## 🔑 Usuários Cadastrados (após executar seed)

### 👨‍💼 Usuários Comuns

#### Usuário 1
- **Nome:** João Silva
- **Email:** `joao@example.com`
- **Senha:** `senha123`
- **Tipo:** Usuário
- **Localização:** São Paulo - SP

#### Usuário 2
- **Nome:** Maria Santos
- **Email:** `maria@example.com`
- **Senha:** `senha123`
- **Tipo:** Usuário
- **Localização:** Rio de Janeiro - RJ

---

### 🎨 Tatuadores

#### Tatuador 1 - Carlos Tattoo
- **Nome:** Carlos Tattoo
- **Email:** `carlos@tattoo.com`
- **Senha:** `senha123`
- **Tipo:** Tatuador
- **Estilos:** Old School, Tradicional
- **Localização:** São Paulo - SP

#### Tatuador 2 - Ana Ink
- **Nome:** Ana Ink
- **Email:** `ana@tattoo.com`
- **Senha:** `senha123`
- **Tipo:** Tatuador
- **Estilos:** Realismo, Aquarela
- **Localização:** Rio de Janeiro - RJ

#### Tatuador 3 - Pedro Black
- **Nome:** Pedro Black
- **Email:** `pedro@tattoo.com`
- **Senha:** `senha123`
- **Tipo:** Tatuador
- **Estilos:** Blackwork, Geométrico
- **Localização:** Belo Horizonte - MG

#### Tatuador 4 - Juliana Art
- **Nome:** Juliana Art
- **Email:** `juliana@tattoo.com`
- **Senha:** `senha123`
- **Tipo:** Tatuador
- **Estilos:** Minimalista, Geométrico
- **Localização:** Curitiba - PR

#### Tatuador 5 - Roberto Samurai
- **Nome:** Roberto Samurai
- **Email:** `roberto@tattoo.com`
- **Senha:** `senha123`
- **Tipo:** Tatuador
- **Estilos:** Japonês, Tradicional
- **Localização:** São Paulo - SP

---

## 🚀 Como Usar

### Opção 1: Popular o Banco de Dados (Recomendado)

Execute o seed para criar todos os usuários automaticamente:

```bash
# Com Docker
docker-compose exec app npm run seed

# Sem Docker
npm run seed
```

### Opção 2: Criar Conta Manualmente

1. Acesse: `http://localhost:3000`
2. Clique em **"Cadastrar-se"**
3. Preencha os dados:
   - Nome completo
   - Email válido
   - Senha (mínimo 6 caracteres com 1 número)
   - Confirme a senha
   - Escolha o tipo: Usuário ou Tatuador
4. Clique em **"Cadastrar"**
5. Faça login com as credenciais criadas

---

## ⚠️ Importante

- **Senha padrão para seed:** `senha123`
- **Todos os usuários do seed compartilham a mesma senha**
- **Para segurança em produção, altere as senhas!**

---

## 🔧 Troubleshooting

### Não consigo fazer login

1. Verifique se o banco está populado:
```bash
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
use EasyTattoDB
db.users.find()
```

2. Execute o seed novamente:
```bash
docker-compose exec app npm run seed
```

### Esqueci minha senha

Se criou uma conta manualmente e esqueceu a senha:
1. Execute o seed para resetar o banco
2. Ou implemente função de recuperação de senha (futura feature)

---

## 📝 Resumo Rápido

**Para testar rapidamente:**

```bash
# 1. Executar seed
docker-compose exec app npm run seed

# 2. Acessar
http://localhost:3000

# 3. Login como usuário
Email: joao@example.com
Senha: senha123

# OU login como tatuador
Email: carlos@tattoo.com
Senha: senha123
```

---

## 🎯 Teste Completo

Para testar todas as funcionalidades:

1. **Login como Usuário** (`joao@example.com`)
   - Ver feed de posts
   - Curtir posts
   - Comentar posts
   - Buscar tatuadores

2. **Login como Tatuador** (`carlos@tattoo.com`)
   - Ver feed de posts
   - Criar novos posts
   - Upload de imagens
   - Gerenciar perfil

---

**Agora você está pronto para explorar o Easy Tattoo! 🎨**
