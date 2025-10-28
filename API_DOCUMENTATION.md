# SENAI Bathroom Reporting System - API Documentation

## Base URL

```
http://localhost:3000/api
```

## Public Endpoints

### Create New Report

Create a new bathroom issue report.

**Endpoint:** `POST /reportes`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
``json
{
  "ra": "string (5-20 characters)",
  "predio": "string",
  "andar": "string",
  "tipo_banheiro": "string (masculino|feminino)",
  "problemas": ["string"],
  "outro_problema": "string (optional, max 500 chars)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "123456",
    "predio": "Prédio A",
    "andar": "1º Andar",
    "tipo_banheiro": "masculino",
    "problemas": ["Falta de papel higiênico", "Lixeira cheia"],
    "outro_problema": "Espelho quebrado"
  }'
```

**Success Response (201):**
``json
{
  "success": true,
  "message": "Obrigado pela sua contribuição!",
  "report_id": 123
}
```

**Error Responses:**
- 400: Erros de validação
- 429: Limite de taxa excedido (5 relatórios por hora por RA)

---

### Get Problem Categories

Retrieve all problem categories grouped by type.

**Endpoint:** `GET /reportes/categorias`

**Example Request:**
``bash
curl -X GET http://localhost:3000/api/reportes/categorias
```

**Success Response (200):**
```json
{
  "success": true,
  "categories": {
    "higiene": [
      {
        "id": 1,
        "descricao": "Falta de papel higiênico",
        "ativo": true,
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    ],
    "hidraulica": [
      {
        "id": 6,
        "descricao": "Descarga não funciona",
        "ativo": true,
        "created_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Available Buildings

Retrieve all available buildings.

**Endpoint:** `GET /reportes/predios`

**Example Request:**
``bash
curl -X GET http://localhost:3000/api/reportes/predios
```

**Success Response (200):**
```json
{
  "success": true,
  "buildings": [
    "Prédio A",
    "Prédio B",
    "Prédio C",
    "Prédio D",
    "Biblioteca",
    "Refeitório"
  ]
}
```

---

### Get Available Floors

Retrieve all available floors.

**Endpoint:** `GET /reportes/andares`

**Query Parameters:**
- `predio` (optional): Filter floors by building

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/reportes/andares
```

**Success Response (200):**
```json
{
  "success": true,
  "floors": [
    "Térreo",
    "1º Andar",
    "2º Andar",
    "3º Andar"
  ]
}
```

## Admin Endpoints

All admin endpoints require authentication with a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Admin Login

Authenticate an administrator account.

**Endpoint:** `POST /admin/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@senai.com",
    "password": "admin123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@senai.com",
    "nome": "Administrador",
    "role": "admin",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Validation errors
- 401: Credenciais inválidas

---

### Get All Reports

Retrieve all reports with optional filtering.

**Endpoint:** `GET /admin/reportes`

**Query Parameters:**
- `status` (optional): Filter by status (pendente|em_andamento|resolvido)
- `predio` (optional): Filter by building
- `tipo_banheiro` (optional): Filter by bathroom type (masculino|feminino)
- `limit` (optional): Number of records to return (default: all)
- `offset` (optional): Number of records to skip (default: 0)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/admin/reportes?status=pendente&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "reports": [
    {
      "id": 123,
      "ra": "123456",
      "predio": "Prédio A",
      "andar": "1º Andar",
      "tipo_banheiro": "masculino",
      "problemas": ["Falta de papel higiênico", "Lixeira cheia"],
      "outro_problema": "Espelho quebrado",
      "status": "pendente",
      "prioridade": "media",
      "created_at": "2023-01-01T10:00:00.000Z",
      "updated_at": "2023-01-01T10:00:00.000Z",
      "resolved_at": null,
      "status_history": [
        {
          "id": 1,
          "report_id": 123,
          "status_anterior": null,
          "status_novo": "pendente",
          "responsavel": null,
          "observacao": null,
          "created_at": "2023-01-01T10:00:00.000Z"
        }
      ]
    }
  ],
  "total": 45
}
```

**Error Responses:**
- 401: Token ausente ou inválido

---

### Get Report by ID

Retrieve details of a specific report.

**Endpoint:** `GET /admin/reportes/{id}`

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/admin/reportes/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "report": {
    "id": 123,
    "ra": "123456",
    "predio": "Prédio A",
    "andar": "1º Andar",
    "tipo_banheiro": "masculino",
    "problemas": ["Falta de papel higiênico", "Lixeira cheia"],
    "outro_problema": "Espelho quebrado",
    "status": "pendente",
    "prioridade": "media",
    "created_at": "2023-01-01T10:00:00.000Z",
    "updated_at": "2023-01-01T10:00:00.000Z",
    "resolved_at": null,
    "status_history": [
      {
        "id": 1,
        "report_id": 123,
        "status_anterior": null,
        "status_novo": "pendente",
        "responsavel": null,
        "observacao": null,
        "created_at": "2023-01-01T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- 401: Token ausente ou inválido
- 404: Reporte não encontrado

---

### Update Report Status

Update the status of a report.

**Endpoint:** `PATCH /admin/reportes/{id}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "status": "string (pendente|em_andamento|resolvido)",
  "observacao": "string (optional, max 500 chars)"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/admin/reportes/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "em_andamento",
    "observacao": "Enviado equipe de manutenção"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Status atualizado",
  "report": {
    "id": 123,
    "ra": "123456",
    "predio": "Prédio A",
    "andar": "1º Andar",
    "tipo_banheiro": "masculino",
    "problemas": ["Falta de papel higiênico", "Lixeira cheia"],
    "outro_problema": "Espelho quebrado",
    "status": "em_andamento",
    "prioridade": "media",
    "created_at": "2023-01-01T10:00:00.000Z",
    "updated_at": "2023-01-01T11:00:00.000Z",
    "resolved_at": null
  }
}
```

**Error Responses:**
- 400: Erros de validação
- 401: Token ausente ou inválido
- 404: Reporte não encontrado

---

### Get System Statistics

Retrieve system-wide statistics.

**Endpoint:** `GET /admin/estatisticas`

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/admin/estatisticas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
``json
{
  "success": true,
  "statistics": {
    "total": [
      {
        "count": 150
      }
    ],
    "porStatus": [
      {
        "status": "pendente",
        "count": 45
      },
      {
        "status": "em_andamento",
        "count": 30
      },
      {
        "status": "resolvido",
        "count": 75
      }
    ],
    "porPredio": [
      {
        "predio": "Prédio A",
        "count": 50
      },
      {
        "predio": "Prédio B",
        "count": 40
      }
    ],
    "tempoMedioResolucao": [
      {
        "avg_hours": 18.5
      }
    ],
    "ultimos7Dias": [
      {
        "data": "2025-10-20",
        "count": 12
      },
      {
        "data": "2025-10-21",
        "count": 15
      }
    ]
  }
}
```

**Error Responses:**
- 401: Missing or invalid token

## Error Response Formats

### Validation Error (400)
```json
{
  "error": "Falha na validação",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "RA é obrigatório",
      "path": "ra",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Token de acesso obrigatório"
}
```

### Authorization Error (403)
```json
{
  "error": "Permissões insuficientes"
}
```

### Not Found Error (404)
```json
{
  "error": "Reporte não encontrado"
}
```

### Rate Limit Error (429)
```json
{
  "error": "Muitas solicitações. Você atingiu o limite de 5 reportes por hora."
}
```

### Internal Server Error (500)
```json
{
  "error": "Erro interno do servidor",
  "message": "Ocorreu um erro inesperado"
}
```

## Integration Examples

### JavaScript (Fetch API)

```
// Create a new report
async function createReport(reportData) {
  try {
    const response = await fetch('http://localhost:3000/api/reportes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Report created:', result.report_id);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Admin login
async function adminLogin(credentials) {
  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Store token for future requests
      localStorage.setItem('adminToken', result.token);
      console.log('Login successful');
    } else {
      console.error('Login failed:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Get reports (authenticated)
async function getReports(token) {
  try {
    const response = await fetch('http://localhost:3000/api/admin/reportes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Reports:', result.reports);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Python (Requests)

```python
import requests
import json

# Create a new report
def create_report(report_data):
    try:
        response = requests.post(
            'http://localhost:3000/api/reportes',
            json=report_data
        )
        
        result = response.json()
        
        if response.status_code == 201:
            print(f"Report created: {result['report_id']}")
        else:
            print(f"Error: {result['error']}")
    except Exception as e:
        print(f"Network error: {e}")

# Admin login
def admin_login(credentials):
    try:
        response = requests.post(
            'http://localhost:3000/api/admin/login',
            json=credentials
        )
        
        result = response.json()
        
        if response.status_code == 200:
            # Store token for future requests
            return result['token']
        else:
            print(f"Login failed: {result['error']}")
            return None
    except Exception as e:
        print(f"Network error: {e}")
        return None

# Get reports (authenticated)
def get_reports(token):
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(
            'http://localhost:3000/api/admin/reportes',
            headers=headers
        )
        
        result = response.json()
        
        if response.status_code == 200:
            return result['reports']
        else:
            print(f"Error: {result['error']}")
            return None
    except Exception as e:
        print(f"Network error: {e}")
        return None