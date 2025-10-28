# SENAI Bathroom Reporting System - Backend

Backend RESTful API for the SENAI Bathroom Reporting System built with Node.js, Express, and PostgreSQL.

## 📋 Features

- **Public Reporting**: Students can report bathroom issues via QR code scanning
- **Admin Management**: Administrators can manage reports and update statuses
- **Authentication**: Secure JWT-based authentication for admin panel
- **Rate Limiting**: Prevent abuse with rate limiting per student ID
- **Statistics**: Comprehensive reporting and analytics dashboard

## 🛠️ Tech Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: winston, morgan

## 📁 Project Structure

```
senai-bathroom-backend/
├── src/
│   ├── server.js                 # Main server file
│   ├── config/
│   │   └── database.js          # PostgreSQL configuration
│   ├── models/
│   │   ├── Report.js            # Report model
│   │   ├── Admin.js             # Admin model
│   │   └── ProblemCategory.js   # Problem category model
│   ├── controllers/
│   │   ├── reportController.js  # Report logic
│   │   └── adminController.js   # Admin logic
│   ├── routes/
│   │   ├── reports.js           # Public routes
│   │   └── admin.js             # Protected routes
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Input validation
│   │   ├── rateLimiter.js       # Rate limiting by RA
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   └── database/
│       ├── setup.js             # Database setup script
│       ├── seed.js              # Initial data seeding
│       └── migrations/
│           └── 001_create_tables.sql
├── logs/                         # Application logs
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd senai-bathroom-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
   - Install PostgreSQL if not already installed
   - Create a new database:
     ```sql
     CREATE DATABASE senai_bathroom_db;
     ```
   - Create a user with privileges:
     ```sql
     CREATE USER senai_user WITH ENCRYPTED PASSWORD 'your_password';
     GRANT ALL PRIVILEGES ON DATABASE senai_bathroom_db TO senai_user;
     ```

4. Configure environment variables in the `.env` file:
```env
# Server
PORT=3000
NODE_ENV=development

# Database - Update these with your PostgreSQL configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=senai_bathroom_db
DB_USER=senai_user
DB_PASSWORD=your_password

# JWT - Change this to a secure random string (at least 32 characters)
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_characters
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173
```

5. Set up the database:
```bash
npm run setup
```

6. Seed initial data:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

### Production Deployment

```
npm start
```

## 🗄️ Database Schema

The system uses four main tables:

1. **reports**: Stores all bathroom issue reports
2. **problem_categories**: Defines problem categories
3. **status_history**: Tracks status changes for reports
4. **admins**: Administrator accounts

## 🔌 API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reportes` | Criar um novo relatório de problema no banheiro |
| GET | `/api/reportes/categorias` | Obter todas as categorias de problemas |
| GET | `/api/reportes/predios` | Obter todos os prédios disponíveis |
| GET | `/api/reportes/andares` | Obter todos os andares |

### Admin Endpoints (JWT Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Autenticar usuário administrador |
| GET | `/api/admin/reportes` | Obter todos os relatórios com filtragem |
| GET | `/api/admin/reportes/:id` | Obter detalhes de um relatório específico |
| PATCH | `/api/admin/reportes/:id` | Atualizar status do relatório |
| GET | `/api/admin/estatisticas` | Obter estatísticas do sistema |

## 🔐 Authentication

Admin endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the login endpoint with valid admin credentials.

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Rate Limiting**: 
   - Global: 100 requests per 15 minutes per IP
   - Per Student: 5 reports per hour per RA
3. **Input Validation**: All inputs are validated and sanitized
4. **Password Hashing**: bcryptjs with 10 salt rounds
5. **CORS Protection**: Configured to accept only frontend origin
6. **Helmet Security**: HTTP headers security enhancements

## 📊 Default Admin Accounts

After seeding, the following admin accounts will be available:

1. **Administrator**
   - Email: admin@senai.com
   - Password: admin123

2. **Cleaning Staff**
   - Email: limpeza@senai.com
   - Password: limpeza123

## 📝 Logging

The application uses Winston for logging with the following levels:
- **Error**: For errors and exceptions
- **Warn**: For warnings and non-critical issues
- **Info**: For general information and request logging

Logs are stored in the `logs/` directory:
- `combined.log`: All log entries
- `error.log`: Only error-level entries

## 🧪 Testing

To test the API manually:

1. Create a report:
```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "123456",
    "predio": "Prédio A",
    "andar": "1º Andar",
    "tipo_banheiro": "masculino",
    "problemas": ["Falta de papel higiênico", "Lixeira cheia"]
  }'
```

2. Login as admin:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@senai.com",
    "password": "admin123"
  }'
```

3. Get reports (replace TOKEN with actual JWT):
```bash
curl -X GET http://localhost:3000/api/admin/reportes \
  -H "Authorization: Bearer TOKEN"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- SENAI Cimatec Team

## 🆘 Support

For support, contact the development team or open an issue in the repository.