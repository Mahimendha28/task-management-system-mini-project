# Task and Project Management System

A MERN-based task and project management system for three organizational roles:

- Admin
- Project Manager
- Team Member

The application supports project creation, task assignment, status tracking, file uploads, deadlines, reporting, and role-based dashboards.

## Features

- Secure authentication with JWT
- Role-based dashboards for Admin, Project Manager, and Team Member
- Project creation, editing, and monitoring
- Task creation, assignment, updates, and deletion
- File attachment uploads stored as base64 content
- Deadline and progress tracking
- Overview reports for projects, tasks, and users
- Forgot password and reset password flow

## Role Flow

### Team Member

- Login
- View assigned tasks
- Update task status
- Upload task files
- View project deadlines

### Project Manager

- Login
- Create projects
- Assign tasks
- Set deadlines
- Monitor task progress
- Generate project reports

### Admin

- Manage users
- Monitor all projects
- Generate performance reports
- Maintain project records
- Control system permissions

## Important Access Rule

Public registration is limited to:

- Team Member
- Project Manager

`Admin` is intentionally blocked from self-registration. This avoids unrestricted admin account creation through the public signup form.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT
- Email: Nodemailer with SMTP

## Project Structure

```text
task-management-system-mini-project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup

### 1. Install dependencies

```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment variables

Backend requires:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

Frontend requires:

- `VITE_API_URL`

### 3. Run the backend

```powershell
cd backend
npm run dev
```

### 4. Run the frontend

```powershell
cd frontend
npm run dev
```

## Default Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Build Check

Frontend production checks completed successfully:

- `npm run build`
- `npm run lint`

## Deployment Notes

- Seed at least one initial `Admin` account directly in MongoDB before production use, because public signup does not create admins.
- Configure valid SMTP credentials or registration/password reset email sending will fail.
- Set `FRONTEND_URL` correctly so reset-password links open the deployed frontend.
- Set `VITE_API_URL` to the deployed backend API URL.
- If you deploy with stricter CSP or blocked third-party media, some landing/auth background media may need local hosting.

## Known Limitations

- No automated test suite is included.
- Initial admin bootstrap must be done manually.
- Attachments are stored in the database as base64 strings, which is acceptable for mini projects but not ideal for large files in production.

## Demo Summary

This project demonstrates:

- Role-based access control
- CRUD operations for users, projects, and tasks
- Reporting and dashboard views
- Authentication and password reset handling
- A polished frontend interface for project workflow management
