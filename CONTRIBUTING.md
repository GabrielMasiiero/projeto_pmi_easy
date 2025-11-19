# 🤝 Contribuindo com o Easy Tattoo

Obrigado por considerar contribuir com o Easy Tattoo! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Pull Requests](#pull-requests)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)

## 🚀 Como Contribuir

### 1. Fork o Repositório

Clique no botão "Fork" no canto superior direito da página do repositório.

### 2. Clone seu Fork

```bash
git clone https://github.com/seu-usuario/projeto_pmi_easy.git
cd projeto_pmi_easy
```

### 3. Crie uma Branch

```bash
git checkout -b feature/minha-nova-feature
```

Tipos de branches:
- `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração
- `test/` - Testes

### 4. Faça suas Alterações

Desenvolva sua feature ou correção seguindo os [padrões de código](#padrões-de-código).

### 5. Commit suas Mudanças

```bash
git add .
git commit -m "tipo: descrição breve da mudança"
```

Veja [Commits](#commits) para mais detalhes.

### 6. Push para seu Fork

```bash
git push origin feature/minha-nova-feature
```

### 7. Abra um Pull Request

Vá até o repositório original e clique em "New Pull Request".

## 🐛 Reportando Bugs

Ao reportar um bug, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir** o bug
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** (se aplicável)
- **Ambiente** (SO, Node version, Docker version, etc)
- **Logs de erro** relevantes

### Template de Issue para Bug

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
 - SO: [ex: Ubuntu 22.04]
 - Node: [ex: 20.10.0]
 - Docker: [ex: 24.0.7]
 - Navegador: [ex: Chrome 120]

**Informações Adicionais**
Qualquer outra informação relevante.
```

## 💡 Sugerindo Melhorias

Ao sugerir uma melhoria:

- **Use um título claro e descritivo**
- **Explique o problema atual** (se houver)
- **Descreva a solução proposta**
- **Descreva alternativas** que você considerou
- **Adicione contexto adicional** (mockups, referências, etc)

## 🔀 Pull Requests

### Checklist antes de Submeter

- [ ] Código segue os padrões do projeto
- [ ] Comentários foram adicionados onde necessário
- [ ] Documentação foi atualizada (se aplicável)
- [ ] Não há warnings de lint
- [ ] Testei localmente
- [ ] Testei com Docker
- [ ] Commit messages seguem o padrão

### Processo de Review

1. Mantenedor revisa o PR
2. Discussões e ajustes (se necessário)
3. Aprovação
4. Merge

### O que NÃO fazer

- ❌ Commitar código comentado desnecessariamente
- ❌ Incluir arquivos de configuração pessoal
- ❌ Fazer mudanças não relacionadas no mesmo PR
- ❌ Commitar arquivos grandes (imagens, vídeos)
- ❌ Expor credenciais ou dados sensíveis

## 📝 Padrões de Código

### JavaScript / Node.js

```javascript
// Use const/let ao invés de var
const userName = 'João';
let userAge = 25;

// Use arrow functions quando apropriado
const getUserName = (user) => user.name;

// Use template literals
const greeting = `Olá, ${userName}!`;

// Use async/await ao invés de callbacks
async function getUser(id) {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Sempre trate erros
app.get('/users/:id', async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Comentários

```javascript
/**
 * Descrição da função
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
async function getUserById(userId) {
    // Implementação
}

// Comentários inline apenas quando necessário
const complexCalculation = value * 2; // Multiplica por 2 porque...
```

### Nomenclatura

```javascript
// PascalCase para classes e modelos
class User {}
const UserModel = mongoose.model('User');

// camelCase para variáveis e funções
const userName = 'João';
function getUserName() {}

// UPPER_SNAKE_CASE para constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// kebab-case para arquivos
user-controller.js
auth-middleware.js
```

### Estrutura de Arquivos

```
src/
├── config/       # Configurações
├── controllers/  # Lógica de negócio
├── middleware/   # Middlewares
├── models/       # Modelos de dados
├── routes/       # Rotas
├── utils/        # Funções utilitárias
├── views/        # Templates
└── app.js        # Aplicação principal
```

## 💬 Commits

### Formato

```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

Refs #123
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
feat(posts): adiciona sistema de curtidas

Implementa funcionalidade de curtir posts com contador
de likes e verificação de duplicatas.

Refs #42

---

fix(auth): corrige validação de email

Email agora é validado corretamente no cadastro.

Refs #56

---

docs(readme): atualiza instruções de instalação
```

## 🧪 Testes

Quando implementados, todos os PRs devem incluir testes:

```javascript
// Teste de exemplo
describe('User Controller', () => {
    it('should create a new user', async () => {
        const userData = {
            nome: 'Teste',
            email: 'teste@example.com',
            senha: 'senha123',
            tipo: 'usuario'
        };
        
        const user = await createUser(userData);
        expect(user).toHaveProperty('_id');
        expect(user.nome).toBe('Teste');
    });
});
```

## 📚 Recursos Adicionais

- [Código de Conduta](CODE_OF_CONDUCT.md)
- [Documentação da API](docs/API.md)
- [Guia de Início](docs/GETTING_STARTED.md)

## ❓ Dúvidas?

Se tiver dúvidas:

1. Verifique a [documentação](docs/)
2. Procure em [Issues](https://github.com/GabrielMasiiero/projeto_pmi_easy/issues)
3. Abra uma nova issue com a tag `question`

## 🙏 Agradecimentos

Obrigado por contribuir com o Easy Tattoo! Cada contribuição, por menor que seja, faz diferença! 🎉
