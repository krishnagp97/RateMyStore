# RateMyStore

A full-stack store rating platform with role-based access for **System Administrators, Normal Users, and Store Owners**.

Built as a full-stack internship coding challenge using React, Express.js, PostgreSQL, Prisma, and JWT authentication.

## Live Application

**Frontend:**
https://rate-my-store-three.vercel.app

**Backend API:**
https://ratemystore-api-34v2.onrender.com

---

## Demo Accounts

Demo credentials are available in:

[`DEMO_ACCOUNTS.md`](./DEMO_ACCOUNTS.md)

These accounts are intended only for demonstration and testing.

---

## Features

### System Administrator

* View and manage users
* Create users with different roles
* View user details
* Create and manage stores
* Assign stores to store owners
* View store rating information
* Manage store-owner relationships

### Normal User

* Sign up and log in
* Browse available stores
* Search stores by name or address
* View store details and ratings
* Submit ratings
* Update password

### Store Owner

* Log in securely
* View owned stores
* Add stores
* View store rating information
* Update password

---

## Authentication & Authorization

The application uses **JWT-based authentication** with role-based authorization.

* Passwords are hashed using `bcryptjs`
* JWT tokens are used for authenticated requests
* Protected API routes require authentication
* Role-based middleware restricts access to authorized users
* Users can only access functionality allowed by their role
* Ownership checks prevent unauthorized access to store resources

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* shadcn/ui
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* JWT
* bcryptjs
* Zod
* CORS

### Database

* PostgreSQL

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Neon

---

## Architecture

```text
┌──────────────────────────────┐
│          Vercel              │
│      React + Vite Frontend   │
└──────────────┬───────────────┘
               │
               │ HTTPS REST API
               ▼
┌──────────────────────────────┐
│          Render              │
│     Express.js Backend       │
│       Prisma ORM             │
└──────────────┬───────────────┘
               │
               │ PostgreSQL
               ▼
┌──────────────────────────────┐
│            Neon              │
│       PostgreSQL Database    │
└──────────────────────────────┘
```

---

## Project Structure

```text
RateMyStore/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   └── user/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── vercel.json
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── server.ts
│   │
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── DEMO_ACCOUNTS.md
└── README.md
```

---

## Running Locally

### Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL database or Neon account
* Git

### Clone the repository

```bash
git clone https://github.com/krishnagp97/RateMyStore.git
cd RateMyStore
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="1d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend

The backend requires:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1d
PORT=5000
CLIENT_URL=
```

### Frontend

The frontend requires:

```env
VITE_API_URL=
```

`VITE_API_URL` contains the public API endpoint and is intentionally exposed to the browser.

**Never commit `.env` files or expose secrets such as `DATABASE_URL` or `JWT_SECRET` in the frontend.**

---

## Database

The project uses **PostgreSQL** with **Prisma ORM**.

Prisma Client is generated with:

```bash
npx prisma generate
```

For development, database schema changes can be applied using Prisma migrations:

```bash
npx prisma migrate dev
```

---

## Author

**Krishna Gopal Pathak**

B.Tech Mathematics & Computing
Central University of Karnataka

GitHub:
https://github.com/krishnagp97

---

## License

This project was developed as part of a full-stack internship coding challenge and is intended primarily for learning and demonstration purposes.
