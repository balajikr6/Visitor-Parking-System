# Visitor Parking Management System

A comprehensive web-based visitor parking management system built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: Secure login/logout system with JWT tokens
- **Visitor Management**: Add, edit, delete visitor records
- **Real-time Tracking**: Track vehicle entry/exit status
- **Data Export**: Download visitor data as Excel or PDF
- **Search & Filter**: Advanced filtering by date, status, plate number
- **Responsive UI**: Modern Bootstrap-based interface
- **Security**: Protected routes with role-based access

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: EJS Templates, Bootstrap 5
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Generation**: ExcelJS, PDFKit

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone/Extract Project
```bash
# If cloning from repository
git clone <repository-url>

# Or extract the ZIP file
```

### 2. Install Dependencies
```bash
cd Visitor-Parking-System
npm install
```

### 3. Database Setup

#### Create Database
```sql
CREATE DATABASE visitor_parking;
```

#### Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
```

#### Run Migrations & Seeds
```bash
# Run database migrations
npx sequelize-cli db:migrate

# Seed demo user account
npx sequelize-cli db:seed:all
```

### 4. Start Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

### 5. Access Application

- **URL**: http://localhost:3000
- **Login**: admin@parking.com
- **Password**: admin123

## Project Structure

```
Visitor-Parking-System/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── views/          # EJS templates
│   └── public/         # Static assets
├── migrations/         # Database migrations
├── seeders/           # Database seeders
├── config/            # Configuration files
└── package.json       # Dependencies
```

## Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visitor_parking
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=20m

# Server
PORT=3000
NODE_ENV=development

# Email (optional - for login notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Visitors
- `GET /api/visitors` - Get all visitors (with pagination & filters)
- `POST /api/visitors` - Create new visitor
- `GET /api/visitors/:id` - Get visitor by ID
- `PUT /api/visitors/:id` - Update visitor
- `DELETE /api/visitors/:id` - Delete visitor
- `GET /api/visitors/download/excel` - Download Excel report
- `GET /api/visitors/download/pdf` - Download PDF report

## Postman Collection Examples

### 1. Login Request
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "admin@parking.com",
    "password": "admin123"
}
```

**Response:**
```json
{
    "status": "success",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@parking.com"
        }
    }
}
```

### 2. Get All Visitors
```http
GET http://localhost:3000/api/visitors?page=1&limit=10
Authorization: Bearer {{accessToken}}
```

### 3. Create Visitor
```http
POST http://localhost:3000/api/visitors
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
    "plate_number": "TN01AB12345",
    "visit_date": "2024-01-15", 
    "entry_time": "09:50",
    "entry_gate": "Gate 1",
    "visitor_name": "John Doe",
    "mobile_number": "9876543210",
    "purpose": "Meeting",
    "vehicle_type": "Car",
    "status": "ENTERED"
}
```

### 4. Update Visitor
```http
PUT http://localhost:3000/api/visitors/1
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
    "status": "EXITED",
    "exit_time": "17:30",
    "entry_gate": "Gate 2"
  }
```

### 5. Delete Visitor
```http
DELETE http://localhost:3000/api/visitors/1
Authorization: Bearer {{accessToken}}
```

### 6. Download Excel Report
```http
GET http://localhost:3000/api/visitors/download/excel
Authorization: Bearer {{accessToken}}
```

### 7. Download PDF Report
```http
GET http://localhost:3000/api/visitors/download/pdf
Authorization: Bearer {{accessToken}}
```

### 8. Refresh Token
```http
POST http://localhost:3000/api/auth/refresh-token
Content-Type: application/json

{
    "refreshToken": "{{refreshToken}}"
}
```

### 9. Logout
```http
POST http://localhost:3000/api/auth/logout
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
    "refreshToken": "{{refreshToken}}"
}
```

## cURL Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@parking.com", "password": "admin123"}'
```

### Create Visitor
```bash
curl -X POST http://localhost:3000/api/visitors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "plate_number": "TN01AB12345",
    "visit_date": "2024-01-15",
    "entry_time": "09:50",
    "entry_gate": "Gate 1",
    "visitor_name": "John Doe",
    "mobile_number": "9876543210",
    "purpose": "Meeting",
    "vehicle_type": "Car",
    "status": "ENTERED"
  }'
```

### Get Visitors
```bash
curl -X GET "http://localhost:3000/api/visitors?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Visitor
```bash
curl -X PUT http://localhost:3000/api/visitors/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "EXITED",
    "exit_time": "17:30",
    "entry_gate": "Gate 2"
  }'
```

### Download Excel
```bash
curl -X GET http://localhost:3000/api/visitors/download/excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o visitors.xlsx
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

## Usage Instructions

### Adding a Visitor
1. Login to dashboard
2. Click "Add Visitor" button
3. Fill in visitor details:
   - Visitor Name
   - Plate Number
   - Mobile Number
   - Purpose of Visit
   - Entry Gate
   - Vehicle Type
4. Click "Save"

### Managing Visitors
- Edit: Click pencil icon on any visitor record
- Delete: Click trash icon (with confirmation)
- Filter: Use filter form to search by date, status, or text
- Export: Download data as Excel or PDF using top buttons

### Vehicle Status
- ENTERED: Vehicle currently parked
- EXITED: Vehicle has left the premises
- CANCELLED: Entry was cancelled

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Rate limiting on login attempts
- CORS protection
- Helmet.js security headers
- SQL injection protection via Sequelize ORM
- XSS protection with EJS templating

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL service is running
   - Verify .env database credentials
   - Ensure database exists

2. **Migration Failures**
   - Drop and recreate database
   - Run migrations again

3. **Login Issues**
   - Verify seeded user exists
   - Check JWT_SECRET in .env
   - Clear browser cookies

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing Node.js processes

### Logs
Check application logs for detailed error information:
- Development: Console output
- Production: Check configured logging system

## Assumptions & Notes

1. **Single Admin User**: System assumes one admin user (can be extended)
2. **Default Vehicle Types**: Car, Bike, Truck (configurable)
3. **Time Format**: 24-hour format for entry/exit times
4. **Date Format**: YYYY-MM-DD for visit dates
5. **Soft Delete**: Visitor records are soft-deleted (can be recovered)
6. **Duplicate Prevention**: Same plate cannot have multiple active entries per day

## Support

For technical support or modifications:
- Check the troubleshooting section first
- Review error logs for specific issues
- Contact the development team for assistance

## License

This project is proprietary and intended for client use only.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Developer**: Development Team
