# RateMyStore

A full-stack store rating platform where users can discover stores, submit ratings, and manage their accounts, while store owners can manage their stores and administrators can manage users and stores.

## Features

### 👤 Normal User

* Sign up and login
* Browse and search stores
* Search stores by name and address
* View store ratings
* Submit ratings
* Update password

### 🏪 Store Owner

* Login securely
* View owned stores
* Add stores
* View store ratings
* Update password

### 🛡️ Administrator

* Admin dashboard
* View users
* Search and filter users
* Create users
* View user details
* View owned stores
* View all stores
* Search and filter stores
* Add stores and assign them to owners

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Protected routes
* Separate permissions for Admin, User, and Store Owner
* Password hashing
* Server-side validation

---

## Tech Stack

### Frontend

* React.js
* TypeScript
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
* PostgreSQL
* JWT
* bcrypt

---

## Project Structure

```text
RateMyStore/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── DEMO_ACCOUNTS.md
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/krishnagp97/RateMyStore.git
cd RateMyStore
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## Environment Variables

### Server

Create:

```text
server/.env
```

Add:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### Client

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL="http://localhost:5000/api"
```

Do not commit `.env` files or real credentials to GitHub.

---

## Database Setup

From the `server` directory:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start Prisma Studio if you want to inspect the database:

```bash
npx prisma studio
```

---

## Running the Application

### Start the backend

From:

```text
server/
```

run:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

From:

```text
client/
```

run:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## Demo Accounts

Demo login credentials are available in:

**[DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md)**

The demo accounts include:

* Admin
* Normal User
* Store Owner

These accounts are intended only for testing and demonstration.

---

## Authentication Flow

```text
User
  │
  ▼
Login
  │
  ▼
Backend validates credentials
  │
  ▼
JWT generated
  │
  ▼
JWT stored by client
  │
  ▼
Protected API requests
  │
  ▼
Authentication middleware
  │
  ▼
Role-based authorization
  │
  ├── ADMIN ──► Admin Dashboard
  │
  ├── USER ───► Store Browsing
  │
  └── OWNER ──► Owner Dashboard
```

---


## Author

**Krishna Gopal Pathak**

B.Tech Mathematics & Computing
Central University of Karnataka

GitHub: [krishnagp97](https://github.com/krishnagp97)

---

## License

This project is developed for learning, demonstration, and internship evaluation purposes.
