# DigitalEra — Full-Stack Blogging CMS

DigitalEra is a modern, responsive, and SEO-friendly blogging platform built with React, Node.js, and PostgreSQL. It features a high-performance public website and a secure, enterprise-grade admin panel.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `digitalera`.
Update the `DATABASE_URL` in `server/.env`.

### 2. Installation
Install dependencies for both frontend and backend teams:
```bash
npm run install:all
```

### 3. Database Migration & Seeding
```bash
npm run db:migrate
npm run db:seed
```

### 4. Run the Application
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

---

## 🔐 Admin Credentials
- **Email**: `admin@digitalera.com`
- **Password**: `admin123`

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Quill
- **Backend**: Node.js, Express, Prisma ORM, JWT, Multer
- **Database**: PostgreSQL
- **SEO**: React Helmet Async, Slug generation

---

## 📁 Project Structure
- `/client`: React Vite application
- `/server`: Node.js Express API
- `/server/prisma`: Database schema and seed scripts
- `/server/uploads`: Local storage for article images
