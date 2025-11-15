# Admin Dashboard Template

Template completo para dashboards administrativos com arquitetura de microserviços.

## 📋 Visão Geral

Este projeto é um template completo de dashboard administrativo construído com tecnologias modernas e arquitetura de microserviços. Inclui autenticação, gerenciamento de usuários, visualizações de dados com gráficos, sistema de notificações e tema dark/light.

## ✨ Características

### 📊 Componentes

- **Gráficos Diversos**: LineChart, BarChart, AreaChart, PieChart (usando Recharts)
- **Tabelas Interativas**: Sorting, filtering e busca
- **Sistema de Notificações**: Notificações em tempo real com toast
- **Gestão de Usuários**: CRUD completo de usuários
- **Tema Dark/Light**: Alternância de tema com Radix UI
- **Totalmente Responsivo**: Design mobile-first

### 🛠️ Stack Tecnológica

#### Backend
- Node.js + Express
- TypeScript
- JWT para autenticação
- Joi para validação
- Jest + Supertest para testes

#### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts para gráficos
- Radix UI para componentes
- Zustand para gerenciamento de estado
- Jest + React Testing Library para testes

#### DevOps
- Docker + Docker Compose
- Arquitetura de microserviços
- Health checks
- Hot reload em desenvolvimento

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (opcional)
- npm ou yarn

### Instalação Local

#### 1. Clone o repositório

```bash
git clone <repository-url>
cd admin-dashboard-template
```

#### 2. Configure as variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. Instale as dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

#### 4. Execute os serviços

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

#### 5. Acesse a aplicação

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### Instalação com Docker

#### 1. Modo Desenvolvimento

```bash
docker-compose up
```

#### 2. Modo Produção

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Parar os serviços

```bash
docker-compose down
```

## 🔐 Autenticação

### Credenciais Padrão

**Administrador:**
- Email: `admin@example.com`
- Senha: `admin123`

**Usuário:**
- Email: `john@example.com`
- Senha: `user123`

### Fluxo de Autenticação

1. Faça login na página `/login`
2. O token JWT será armazenado no localStorage
3. Todas as requisições subsequentes incluem o token no header
4. O token expira em 24 horas

## 📁 Estrutura do Projeto

```
admin-dashboard-template/
├── backend/                    # Microserviço Backend
│   ├── src/
│   │   ├── controllers/       # Controladores da API
│   │   ├── middleware/        # Middlewares (auth, validation)
│   │   ├── models/            # Modelos de dados
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Lógica de negócios
│   │   ├── types/             # Tipos TypeScript
│   │   ├── tests/             # Testes
│   │   └── index.ts           # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Microserviço Frontend
│   ├── src/
│   │   ├── app/               # Páginas Next.js (App Router)
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── login/
│   │   ├── components/        # Componentes React
│   │   │   ├── charts/        # Componentes de gráficos
│   │   │   ├── tables/        # Tabelas de dados
│   │   │   ├── notifications/ # Sistema de notificações
│   │   │   ├── users/         # Gestão de usuários
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # Componentes UI básicos
│   │   ├── lib/               # Utilitários
│   │   │   ├── api.ts         # Cliente API
│   │   │   ├── store.ts       # Zustand stores
│   │   │   └── utils.ts       # Funções utilitárias
│   │   ├── styles/            # Estilos globais
│   │   └── __tests__/         # Testes
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.js
│
├── docker-compose.yml          # Docker Compose (desenvolvimento)
├── docker-compose.prod.yml     # Docker Compose (produção)
└── README.md
```

## 🧪 Testes

### Backend

```bash
cd backend

# Executar todos os testes
npm test

# Executar com coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Frontend

```bash
cd frontend

# Executar todos os testes
npm test

# Executar com coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 📡 API Endpoints

### Autenticação

```
POST /api/auth/login
POST /api/auth/register
```

### Usuários

```
GET    /api/users          # Listar usuários (requer autenticação)
GET    /api/users/:id      # Obter usuário específico
POST   /api/users          # Criar usuário (requer admin)
PUT    /api/users/:id      # Atualizar usuário (requer admin)
DELETE /api/users/:id      # Deletar usuário (requer admin)
```

### Dashboard

```
GET /api/dashboard/stats              # Estatísticas do dashboard
GET /api/dashboard/charts/:type       # Dados dos gráficos (revenue, users, activity)
```

### Health Check

```
GET /health                           # Status do servidor
```

## 🎨 Componentes Reutilizáveis

### Gráficos

```tsx
import { LineChart, BarChart, AreaChart, PieChart } from '@/components/charts';

<LineChart data={data} dataKey="value" height={300} />
<BarChart data={data} dataKey="value" color="#3b82f6" />
<AreaChart data={data} dataKey="value" />
<PieChart data={data} />
```

### Tabelas

```tsx
import { DataTable } from '@/components/tables/DataTable';

const columns = [
  { key: 'name', header: 'Nome' },
  { key: 'email', header: 'Email' },
];

<DataTable data={users} columns={columns} searchable />
```

### Notificações

```tsx
import { useNotificationStore } from '@/lib/store';

const { addNotification } = useNotificationStore();

addNotification({
  title: 'Sucesso',
  message: 'Operação realizada com sucesso',
  type: 'success',
  read: false,
});
```

### Tema Dark/Light

```tsx
import { useThemeStore } from '@/lib/store';

const { theme, toggleTheme } = useThemeStore();
```

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| PORT | Porta do servidor | 3001 |
| NODE_ENV | Ambiente | development |
| JWT_SECRET | Chave secreta JWT | - |
| CORS_ORIGIN | Origem CORS permitida | http://localhost:3000 |

#### Frontend (.env)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| NEXT_PUBLIC_API_URL | URL da API | http://localhost:3001 |

## 📦 Build para Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Docker Produção

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🎯 Roadmap

- [ ] Adicionar banco de dados (PostgreSQL/MongoDB)
- [ ] Implementar Redis para cache
- [ ] Adicionar suporte a websockets
- [ ] Implementar upload de arquivos
- [ ] Adicionar mais tipos de gráficos
- [ ] Implementar exports (PDF, Excel)
- [ ] Adicionar autenticação OAuth
- [ ] Implementar internacionalização (i18n)
- [ ] Adicionar logs estruturados
- [ ] Implementar rate limiting

## 💡 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Express Documentation](https://expressjs.com/)

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento. Se encontrar algum bug, por favor abra uma issue.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

⭐ Se este projeto foi útil, considere dar uma estrela!
