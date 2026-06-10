# TekstilHub.uz — Wholesale Clothing Platform

**BTEC HND Level 4 | Unit 6: Cloud Networking**  
Student: Ibrohim | Student ID: 240275 | Group: 24-412

---

## Stack

- **Frontend:** React 18 + Vite + TailwindCSS + Recharts
- **Backend:** Node.js + Express + Sequelize ORM
- **Database:** PostgreSQL 16
- **Infrastructure:** Docker Compose + Nginx
- **CI/CD:** GitHub Actions → AWS ECR → EC2

---

## Local Setup (Docker)

```bash
# 1. Clone and go to project
cd tekstilhub

# 2. Create .env file
cp .env.example .env

# 3. Start everything
docker-compose up --build

# 4. Seed database (first time only)
docker exec tekstilhub-backend node src/utils/seed.js
```

App runs at: **http://localhost**

---

## Login

| Email | Password | Role |
|-------|----------|------|
| admin@tekstilhub.uz | admin123 | Admin |
| manager@tekstilhub.uz | manager123 | Manager |
| user@tekstilhub.uz | user123 | User |

---

## Project Structure

```
tekstilhub/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # Home, Login, Dashboard, Products, Orders, Customers, Inventory
│   │   ├── components/ # Layout (Sidebar + Topbar)
│   │   ├── context/   # AuthContext
│   │   └── api/       # Axios instance + API calls
│   └── Dockerfile
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── models/    # User, Product, Customer, Order, Inventory
│   │   ├── routes/    # auth, products, customers, orders, dashboard
│   │   ├── middleware/ # JWT auth
│   │   └── utils/     # seed.js
│   └── Dockerfile
├── nginx/
│   └── nginx.conf     # Reverse proxy + load balancer config
├── .github/workflows/
│   └── deploy.yml     # CI/CD pipeline
└── docker-compose.yml
```

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Public marketing page |
| Login | `/login` | JWT authentication |
| Dashboard | `/dashboard` | ERP analytics + charts |
| Products | `/products` | Product catalog + CRUD |
| Orders | `/orders` | Order management |
| Customers | `/customers` | CRM - customer tiers |
| Inventory | `/inventory` | WMS - stock tracking |

---

## API Endpoints

```
POST   /api/auth/login
GET    /api/auth/me
GET    /api/dashboard/summary
GET    /api/dashboard/revenue-chart
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/customers
POST   /api/customers
GET    /api/orders
POST   /api/orders
PATCH  /api/orders/:id/status
GET    /api/inventory
GET    /health
```

---

## CI/CD Flow (GitHub Actions)

1. Push to `main` branch
2. Run tests + build Docker images
3. Push images to AWS ECR
4. SSH to EC2 → pull images → `docker compose up`
5. Health check on `/health`
