# 📚 Documentação da API - Easy Tattoo

## Índice

- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Posts](#posts)
- [Busca](#busca)
- [Modelos de Dados](#modelos-de-dados)

---

## 🔐 Autenticação

Todas as rotas protegidas requerem que o usuário esteja autenticado via sessão.

### Login

```http
POST /login
Content-Type: application/x-www-form-urlencoded
```

**Body:**
```
email=usuario@example.com
password=senha123
```

**Resposta de Sucesso:**
```http
302 Redirect to /feed
```

**Resposta de Erro:**
```http
400 Bad Request
Content-Type: text/html

Página de login com mensagem de erro
```

### Cadastro

```http
POST /cadastro
Content-Type: application/x-www-form-urlencoded
```

**Body:**
```
username=João Silva
email=joao@example.com
password=senha123
confirmPassword=senha123
role=usuario  # ou 'tatuador'
```

**Resposta de Sucesso:**
```http
302 Redirect to /login
```

### Logout

```http
GET /logout
```

**Resposta:**
```http
302 Redirect to /login
```

---

## 👤 Usuários

### Ver Perfil Próprio

```http
GET /user/perfil
```

**Resposta:**
```http
200 OK
Content-Type: text/html

Página de perfil do usuário logado
```

### Ver Perfil de Outro Usuário

```http
GET /user/perfil/:id
```

**Parâmetros:**
- `id` - ID do usuário

**Resposta:**
```http
200 OK
Content-Type: text/html

Página de perfil do usuário
```

### Atualizar Perfil

```http
PUT /user/perfil
Content-Type: multipart/form-data
```

**Body:**
```
nome=João Silva Atualizado
bio=Nova biografia
telefone=11987654321
cidade=São Paulo
estado=SP
estilos[]=realismo
estilos[]=aquarela
avatar=<arquivo de imagem>
```

**Resposta de Sucesso:**
```json
{
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "nome": "João Silva Atualizado",
    "bio": "Nova biografia",
    "telefone": "11987654321",
    "cidade": "São Paulo",
    "estado": "SP",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg"
  }
}
```

### Buscar Tatuadores

```http
GET /user/busca?query=realismo&cidade=São Paulo&estado=SP
```

**Query Parameters:**
- `query` - Texto de busca (opcional)
- `cidade` - Cidade (opcional)
- `estado` - Estado (opcional, 2 caracteres)
- `estilos` - Array de estilos (opcional)
- `page` - Número da página (opcional, padrão: 1)
- `limit` - Itens por página (opcional, padrão: 12)

**Resposta (JSON):**
```json
{
  "tatuadores": [
    {
      "_id": "...",
      "nome": "Carlos Tattoo",
      "email": "carlos@tattoo.com",
      "tipo": "tatuador",
      "bio": "Especialista em Old School e Tradicional",
      "cidade": "São Paulo",
      "estado": "SP",
      "estilos": ["old-school", "tradicional"],
      "avatar": "/img/default-avatar.png"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTatuadores": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Deletar Conta

```http
DELETE /user/conta
```

**Resposta:**
```json
{
  "message": "Conta deletada com sucesso!"
}
```

---

## 📸 Posts

### Listar Posts (Feed)

```http
GET /posts?page=1&limit=10
```

**Query Parameters:**
- `page` - Número da página (opcional, padrão: 1)
- `limit` - Posts por página (opcional, padrão: 10)

**Resposta (JSON):**
```json
{
  "posts": [
    {
      "_id": "...",
      "author": {...},
      "authorName": "Carlos Tattoo",
      "authorType": "tatuador",
      "description": "Dragão japonês finalizado!",
      "imageUrl": "/uploads/posts/post-1234567890.jpg",
      "tags": ["dragao", "japones"],
      "estilos": ["japones"],
      "likes": ["userId1", "userId2"],
      "likesCount": 2,
      "comments": [...],
      "commentsCount": 5,
      "views": 100,
      "createdAt": "2025-11-19T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalPosts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Ver Post Específico

```http
GET /posts/:id
```

**Resposta:**
```json
{
  "post": {
    "_id": "...",
    "author": {
      "_id": "...",
      "nome": "Carlos Tattoo",
      "email": "carlos@tattoo.com",
      "tipo": "tatuador"
    },
    "description": "Dragão japonês finalizado!",
    "imageUrl": "/uploads/posts/post-1234567890.jpg",
    "tags": ["dragao", "japones"],
    "estilos": ["japones"],
    "likesCount": 15,
    "comments": [
      {
        "_id": "...",
        "user": {...},
        "userName": "João Silva",
        "text": "Trabalho incrível!",
        "createdAt": "2025-11-19T11:00:00.000Z"
      }
    ],
    "commentsCount": 5,
    "views": 101
  }
}
```

### Criar Post

```http
POST /posts
Content-Type: multipart/form-data
```

**Body:**
```
description=Novo trabalho finalizado!
image=<arquivo de imagem>
tags[]=realismo
tags[]=retrato
estilos[]=realismo
```

**Resposta:**
```json
{
  "message": "Post criado com sucesso!",
  "post": {
    "_id": "...",
    "author": "...",
    "authorName": "Carlos Tattoo",
    "description": "Novo trabalho finalizado!",
    "imageUrl": "/uploads/posts/post-1234567890.jpg",
    "tags": ["realismo", "retrato"],
    "estilos": ["realismo"]
  }
}
```

### Atualizar Post

```http
PUT /posts/:id
Content-Type: multipart/form-data
```

**Body:**
```
description=Descrição atualizada
image=<novo arquivo de imagem (opcional)>
tags[]=realismo
estilos[]=realismo
```

**Resposta:**
```json
{
  "message": "Post atualizado com sucesso!",
  "post": {...}
}
```

### Deletar Post

```http
DELETE /posts/:id
```

**Resposta:**
```json
{
  "message": "Post deletado com sucesso!"
}
```

### Curtir/Descurtir Post

```http
POST /posts/:id/like
```

**Resposta:**
```json
{
  "message": "Post curtido",
  "likesCount": 16,
  "hasLiked": true
}
```

### Adicionar Comentário

```http
POST /posts/:id/comments
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Trabalho incrível! Parabéns!"
}
```

**Resposta:**
```json
{
  "message": "Comentário adicionado com sucesso!",
  "commentsCount": 6
}
```

### Deletar Comentário

```http
DELETE /posts/:id/comments/:commentId
```

**Resposta:**
```json
{
  "message": "Comentário deletado com sucesso!",
  "commentsCount": 5
}
```

---

## 🔍 Busca

### Buscar Posts

```http
GET /posts/search?query=dragao&estilos=japones&authorType=tatuador&page=1&limit=10
```

**Query Parameters:**
- `query` - Texto de busca (opcional)
- `tags` - Array de tags (opcional)
- `estilos` - Array de estilos (opcional)
- `authorType` - Tipo de autor: 'usuario' ou 'tatuador' (opcional)
- `page` - Número da página (opcional, padrão: 1)
- `limit` - Posts por página (opcional, padrão: 10)

**Resposta:**
```json
{
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalPosts": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 📊 Modelos de Dados

### User

```javascript
{
  "_id": ObjectId,
  "nome": String,           // Obrigatório
  "email": String,          // Obrigatório, único
  "senha": String,          // Obrigatório, hash
  "tipo": String,           // 'usuario' ou 'tatuador'
  "bio": String,            // Máx 500 caracteres
  "telefone": String,
  "cidade": String,
  "estado": String,         // 2 caracteres
  "avatar": String,         // URL da imagem
  "estilos": [String],      // Array de estilos
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Post

```javascript
{
  "_id": ObjectId,
  "author": ObjectId,       // Referência ao User
  "authorName": String,
  "authorType": String,     // 'usuario' ou 'tatuador'
  "description": String,    // Obrigatório, máx 500 caracteres
  "imageUrl": String,       // Obrigatório
  "tags": [String],
  "estilos": [String],
  "likes": [ObjectId],      // Array de User IDs
  "likesCount": Number,
  "comments": [{
    "_id": ObjectId,
    "user": ObjectId,
    "userName": String,
    "text": String,
    "createdAt": Date
  }],
  "commentsCount": Number,
  "views": Number,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Estilos Disponíveis

```javascript
[
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
```

---

## ⚠️ Códigos de Erro

### 400 - Bad Request
Requisição inválida, dados faltando ou incorretos.

### 401 - Unauthorized
Usuário não autenticado.

### 403 - Forbidden
Usuário não tem permissão para acessar o recurso.

### 404 - Not Found
Recurso não encontrado.

### 500 - Internal Server Error
Erro interno do servidor.

---

## 🔒 Segurança

- Todas as senhas são hasheadas com bcrypt
- Rate limiting aplicado (100 req/15min geral, 5 req/15min para login)
- Helmet aplicado para headers de segurança
- Express Validator para validação de entrada
- Validação de tipo e tamanho de arquivo para uploads
- Sessões persistentes no MongoDB

---

## 📝 Notas

- Todas as datas estão no formato ISO 8601
- Tamanho máximo de upload: 5MB
- Tipos de arquivo aceitos: JPEG, PNG, JPG, WEBP
- Paginação padrão: 10 itens por página
- Soft delete implementado (posts e usuários)

---

## 🧪 Exemplos de Uso

### Exemplo com cURL

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=carlos@tattoo.com&password=senha123" \
  -c cookies.txt

# Criar Post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: multipart/form-data" \
  -F "description=Novo trabalho!" \
  -F "image=@/path/to/image.jpg" \
  -F "tags[]=realismo" \
  -F "estilos[]=realismo" \
  -b cookies.txt

# Buscar Posts
curl -X GET "http://localhost:3000/posts/search?query=dragao&estilos=japones" \
  -b cookies.txt
```

### Exemplo com JavaScript (Fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'email=carlos@tattoo.com&password=senha123'
  });
  return response;
};

// Curtir Post
const likePost = async (postId) => {
  const response = await fetch(`/posts/${postId}/like`, {
    method: 'POST'
  });
  const data = await response.json();
  console.log(data.likesCount);
};

// Adicionar Comentário
const addComment = async (postId, text) => {
  const response = await fetch(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};
```
