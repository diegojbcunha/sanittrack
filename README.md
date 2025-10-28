# SanitTrack - Sistema de Reporte de Banheiros do SENAI

Backend RESTful API para o sistema de reporte de problemas em banheiros do SENAI, permitindo que estudantes registrem problemas através de QR Codes e que a equipe de manutenção/administração acompanhe e resolva esses problemas.

## 📋 Funcionalidades

- **Reporte Público**: Estudantes podem reportar problemas nos banheiros através de leitura de QR Code
- **Painel Administrativo**: Equipe de administração pode gerenciar os reportes e atualizar seus status
- **Autenticação Segura**: Sistema de autenticação baseado em JWT para o painel administrativo
- **Controle de Taxa**: Limitação de requisições por RA do aluno para evitar abuso
- **Estatísticas**: Dashboard com relatórios e análises completas
- **Histórico de Status**: Acompanhamento completo das mudanças de status dos reportes

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (jsonwebtoken + bcryptjs)
- **Validação**: express-validator
- **Segurança**: helmet, cors, express-rate-limit
- **Logging**: winston, morgan

## 📁 Estrutura do Projeto

```
sanittrack/
├── src/
│   ├── server.js                 # Arquivo principal do servidor
│   ├── config/
│   │   └── database.js          # Configuração do PostgreSQL
│   ├── models/
│   │   ├── Report.js            # Modelo de reporte
│   │   ├── Admin.js             # Modelo de administrador
│   │   └── ProblemCategory.js   # Modelo de categoria de problema
│   ├── controllers/
│   │   ├── reportController.js  # Lógica de reportes
│   │   └── adminController.js   # Lógica administrativa
│   ├── routes/
│   │   ├── reports.js           # Rotas públicas
│   │   └── admin.js             # Rotas protegidas
│   ├── middleware/
│   │   ├── auth.js              # Autenticação JWT
│   │   ├── validation.js        # Validação de entrada
│   │   ├── rateLimiter.js       # Limitação de taxa por RA
│   │   └── errorHandler.js      # Tratamento de erros
│   ├── utils/
│   │   └── logger.js            # Logger com Winston
│   └── database/
│       ├── setup.js             # Script de configuração do banco
│       ├── seed.js              # Inserção de dados iniciais
│       └── migrations/
│           └── 001_create_tables.sql
├── logs/                         # Logs da aplicação
├── scripts/                      # Scripts auxiliares
│   └── init-env.js              # Script de inicialização do ambiente
├── .env                          # Variáveis de ambiente (não versionado)
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js v16+
- Banco de dados PostgreSQL
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd sanittrack
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados PostgreSQL:
   - Instale o PostgreSQL caso ainda não esteja instalado
   - Crie um novo banco de dados
   - Crie um usuário com privilégios adequados

4. Inicialize o ambiente (opcional):
   
   Execute o script de inicialização para criar o arquivo .env:
   ```bash
   npm run init-env
   ```
   
   Este script criará um arquivo .env com base no .env.example e gerará uma chave JWT segura.

5. Configure as variáveis de ambiente:
   
   Edite o arquivo `.env` com suas configurações específicas.

6. Configure o banco de dados:
```bash
npm run setup
```

7. Insira os dados iniciais:
```bash
npm run seed
```

8. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

### Deploy em Produção

```bash
npm start
```

## ⚠️ Segurança em Ambientes de Produção

**ATENÇÃO**: Em ambientes de produção, é fundamental:

1. Alterar todas as senhas padrão, especialmente as contas administrativas criadas pelo seed
2. Usar uma chave JWT segura e mantê-la em segredo
3. Configurar permissões adequadas no banco de dados
4. Não expor o arquivo .env em repositórios públicos (já ignorado no .gitignore)
5. Usar HTTPS em produção
6. **Nunca commitar arquivos contendo credenciais reais**

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza quatro tabelas principais:

1. **reports**: Armazena todos os reportes de problemas nos banheiros
2. **problem_categories**: Define as categorias de problemas
3. **status_history**: Rastreia as mudanças de status dos reportes
4. **admins**: Contas de administradores

## 🔌 Endpoints da API

### Endpoints Públicos (Não Requerem Autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/reportes` | Criar um novo relatório de problema no banheiro |
| GET | `/api/reportes/categorias` | Obter todas as categorias de problemas |
| GET | `/api/reportes/predios` | Obter todos os prédios disponíveis |
| GET | `/api/reportes/andares` | Obter todos os andares |

### Endpoints Administrativos (Requerem Autenticação JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/admin/login` | Autenticar usuário administrador |
| GET | `/api/admin/reportes` | Obter todos os relatórios com filtragem |
| GET | `/api/admin/reportes/:id` | Obter detalhes de um relatório específico |
| PATCH | `/api/admin/reportes/:id` | Atualizar status do relatório |
| GET | `/api/admin/estatisticas` | Obter estatísticas do sistema |

## 🔐 Autenticação

Os endpoints administrativos requerem um token JWT no cabeçalho Authorization:

```
Authorization: Bearer <seu_token_jwt>
```

Para obter um token, utilize o endpoint de login com credenciais de administrador válidas.

## 🛡️ Recursos de Segurança

1. **Autenticação JWT**: Autenticação segura baseada em tokens
2. **Limitação de Taxa**: 
   - Global: 100 requisições por 15 minutos por IP
   - Por Aluno: 5 reportes por hora por RA
3. **Validação de Entrada**: Todas as entradas são validadas e sanitizadas
4. **Hash de Senhas**: bcryptjs com 10 rounds de salt
5. **Proteção CORS**: Configurado para aceitar apenas a origem do frontend
6. **Segurança com Helmet**: Melhorias nos cabeçalhos HTTP

## 📝 Logging

A aplicação utiliza Winston para logging com os seguintes níveis:
- **Error**: Para erros e exceções
- **Warn**: Para avisos e problemas não críticos
- **Info**: Para informações gerais e logging de requisições

Os logs são armazenados no diretório `logs/`:
- `combined.log`: Todas as entradas de log
- `error.log`: Apenas entradas de nível erro

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de funcionalidade (`git checkout -b feature/FuncionalidadeIncrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/FuncionalidadeIncrivel`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

## 👥 Autores

- Equipe SENAI Cimatec

## 🆘 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.