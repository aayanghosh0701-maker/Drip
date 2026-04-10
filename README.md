# DRIP — Fullstack Clothing Store

A complete fullstack clothing e-commerce website built with React + Node/Express + MongoDB.

## 🗂 Project Structure

```
drip/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProductCard
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── pages/        # All pages + admin
│   │   └── utils/        # Axios instance
│   └── netlify.toml
└── backend/           # Express API
    ├── models/        # User, Product, Order
    ├── routes/        # auth, products, orders, cart, payment, admin
    ├── middleware/    # JWT auth
    ├── seed.js        # DB seed script
    └── server.js
```

## ✨ Features

- 🛍 Product listing with filters, search, sort, and pagination
- 🛒 Shopping cart (persisted in localStorage)
- 🔐 User auth (JWT — register, login, profile)
- 💳 Checkout with Stripe payment integration
- 📦 Order management & history
- ⭐ Product reviews and ratings
- 🔧 Admin dashboard (stats, products CRUD, orders, users)

---

## 🚀 Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
node seed.js           # Seed database with sample data
npm run dev            # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Fill in your values
npm start              # Starts on http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Any long random string |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard |
| `CLIENT_URL` | Frontend URL (e.g. http://localhost:3000) |

### Frontend `.env`
| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend URL (e.g. http://localhost:5000) |
| `REACT_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key |

---

## 👤 Default Admin Account (after seeding)

```
Email:    admin@drip.com
Password: admin123
```

---

## 🌐 Deployment

### Frontend → Netlify
1. Push `frontend/` to GitHub
2. Connect to Netlify, set build command: `npm run build`, publish dir: `build`
3. Add `REACT_APP_API_URL` env var pointing to your Render backend URL

### Backend → Render
1. Push `backend/` to GitHub
2. Create new Web Service on Render
3. Build command: `npm install`, Start command: `npm start`
4. Add all `.env` variables in Render dashboard

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Add your IP to the allowlist
3. Copy connection string into `MONGO_URI`

---

## 💳 Stripe Setup
1. Create account at stripe.com
2. Get test keys from Dashboard → Developers → API Keys
3. Use test card: `4242 4242 4242 4242` (any future expiry, any CVC)
