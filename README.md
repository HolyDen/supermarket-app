# 🛒 Supermarket Application

> A modern full-stack e-commerce application built with Flask, MongoDB, and React + TypeScript

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

[🚀 View Live Demo](https://your-app-name.onrender.com) • [📖 API Documentation](#-api-endpoints) • [🐛 Report Bug](https://github.com/HolyDen/supermarket-app/issues)

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🛍️ **Product Catalog** - Browse products with category filtering
- 🛒 **Shopping Cart** - Add/remove items with real-time updates
- 📦 **Order Management** - Complete checkout and view order history
- 👨‍💼 **Admin Dashboard** - Full CRUD operations for products
- 🎨 **Modern UI** - Responsive design with React and TypeScript
- 🐳 **Docker Support** - One-command deployment
- 📱 **Mobile Friendly** - Works seamlessly on all devices

---

## 🏗️ Tech Stack

### Backend
- **Python 3.11+** - Core language
- **Flask** - Web framework
- **MongoEngine** - MongoDB ORM
- **Flask-JWT-Extended** - Authentication
- **Flask-CORS** - Cross-origin support

### Frontend
- **Vite** - Build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Axios** - HTTP client

### Database
- **MongoDB** - NoSQL database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.11 or higher
- **Node.js** 18+ and npm
- **Docker** and Docker Compose (latest)
- **MongoDB** 6.0+ (if running locally without Docker)

### 🛠️ Recommended VS Code Extensions

This project works best with the following VS Code extension:

- **Tailwind CSS IntelliSense** - Autocomplete and syntax highlighting for Tailwind

When you open the project in VS Code, you'll be prompted to install recommended extensions.

Alternatively, install manually:
1. Open VS Code Extensions (`Ctrl+Shift+X`)
2. Search for "Tailwind CSS IntelliSense"
3. Click Install

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/HolyDen/supermarket-app.git
cd supermarket-app

# Start all services
docker-compose up --build
```

That's it! The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

The database will be automatically seeded with sample data on first run.

---

## 💻 Local Development Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# (Optional) Seed database with test data
python seed_test.py

# Or seed with full dataset
python seed.py

# Run the application
python app.py
```

Backend will run on http://localhost:5000

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/supermarket_db

# Security Keys (Change these in production!)
JWT_SECRET_KEY=dev_jwt_a8f5b2c9d3e7f1a4b6c8d0e2f4a6b8c0d1e3f5a7
SECRET_KEY=dev_flask_x9y2z5a8b1c4d7e0f3g6h9i2j5k8l1m4n7p0

# Environment
FLASK_ENV=development

# CORS
CORS_ORIGINS=http://localhost:5173
```

**⚠️ Production Security:**
- Generate new secrets using: `python -c "import secrets; print(secrets.token_hex(32))"`
- Never commit production secrets to version control
- Use environment variables provided by your hosting platform

### Frontend (`frontend/.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

**📝 Note:** For production, update `VITE_API_URL` to your deployed backend URL.

---

## 📁 Project Structure

```
supermarket-app/
│
├── backend/
│   ├── app.py                    # Flask application entry point
│   ├── config.py                 # Configuration settings
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Backend container config
│   ├── .env.example              # Environment variables template
│   ├── seed_test.py              # Test data seeder
│   ├── seed.py                   # Full dataset seeder
│   │
│   ├── models/                   # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   │
│   ├── routes/                   # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication routes
│   │   ├── products.py           # Product CRUD
│   │   └── orders.py             # Order management
│   │
│   └── templates/                # Backend templates
│       └── index.html            # API documentation page
│
├── frontend/
│   ├── index.html                # HTML entry point
│   ├── package.json              # Node dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── tsconfig.node.json        # TypeScript config for Vite
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── Dockerfile                # Frontend container config
│   ├── .env.example              # Environment variables template
│   │
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Root component
│       ├── index.css             # Global styles & Tailwind
│       ├── vite-env.d.ts         # Vite environment types
│       │
│       ├── redux/                # State management
│       │   ├── store.ts          # Redux store config
│       │   ├── authSlice.ts      # Auth state
│       │   ├── cartSlice.ts      # Cart state (localStorage)
│       │   ├── productsSlice.ts  # Products state
│       │   └── themeSlice.ts     # Dark/Light mode state
│       │
│       ├── components/           # Reusable components
│       │   ├── Navbar.tsx
│       │   ├── ProductCard.tsx
│       │   ├── ProductGrid.tsx
│       │   ├── Cart.tsx
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── OrderHistory.tsx
│       │   ├── SearchBar.tsx
│       │   ├── CategoryFilter.tsx
│       │   ├── ThemeToggle.tsx
│       │   ├── Toast.tsx
│       │   ├── LoadingSkeleton.tsx
│       │   ├── EmptyState.tsx
│       │   └── ConfirmModal.tsx
│       │
│       └── pages/                # Page components
│           ├── Home.tsx
│           ├── ProductDetail.tsx
│           ├── CartPage.tsx
│           ├── OrdersPage.tsx
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── AdminPage.tsx
│           └── NotFound.tsx
|
├── .vscode/                  # VS Code workspace settings
│     └── extensions.json       # Recommended extensions
│
├── docker-compose.yml            # Multi-container orchestration
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all products | ❌ |
| GET | `/:id` | Get product details | ❌ |
| POST | `/` | Create product | ✅ Admin |
| PATCH | `/:id` | Update product | ✅ Admin |
| DELETE | `/:id` | Delete product | ✅ Admin |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's order history | ✅ |
| POST | `/` | Create order (checkout) | ✅ |

### Cart

The shopping cart is managed **client-side** using Redux. No API endpoints are required for cart operations (add, remove, update quantity, clear).

---

## 🎯 User Roles

### Regular Users
- ✅ Browse products
- ✅ Add items to cart
- ✅ Complete checkout
- ✅ View order history

### Admin Users
- ✅ All regular user permissions
- ✅ Create new products
- ✅ Update existing products
- ✅ Delete products
- ✅ Upload product images

---

## 🔑 Default Login Credentials

For testing and development purposes, the following accounts are created when seeding the database:

### 👨‍💼 Admin Account
```
Username: admin
Password: admin123
Email: admin@supermarket.com
```
**Permissions:** Full product CRUD access + all user features

### 👤 Test User Account
```
Username: user
Password: user123
Email: user@supermarket.com
```
**Permissions:** Shopping, cart management, order history

⚠️ **Security Note:** These are development credentials only. Change or remove them in production environments.

---

## 🌱 Database Seeding

Two seeder scripts are provided:

### Test Seeder (Quick Testing)
```bash
python backend/seed_test.py
```
- Minimal dataset
- Fast execution
- Perfect for development and testing

### Full Seeder (Production-Ready)
```bash
python backend/seed.py
```
- Complete product catalog with images
- Sample admin and regular users
- Realistic order history
- Ready for demo or production

**🔍 Smart Seeding:** The seeder automatically checks if data exists and skips if the database is already populated.

---

## 🎨 Features Included

### 🌓 Dark/Light Mode
- Toggle between dark and light themes
- Preference saved to localStorage
- Smooth transitions between modes

### 🔍 Search & Filter
- Real-time product search
- Category filtering
- Pagination support

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all devices
- Touch-friendly interface

### ✨ UI/UX Enhancements
- Loading skeletons for better perceived performance
- Toast notifications for user actions
- Empty state designs (cart, orders)
- Confirmation modals for destructive actions
- Image lazy loading
- Smooth animations and transitions

### ♿ Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Semantic HTML structure
- Focus states for interactive elements

---

## 🐳 Docker Configuration

### Services

```yaml
services:
  - mongo      # MongoDB database (port 27017)
  - backend    # Flask API (port 5000)
  - frontend   # React app (port 5173)
```

### Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Rebuild containers
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Access backend container
docker-compose exec backend bash

# Run seeder in Docker
docker-compose exec backend python seed.py
```

### Data Persistence

MongoDB data is persisted using Docker volumes, so your data survives container restarts.

---

## 🧪 Testing the Backend

A Jinja2 template is included for quick backend verification:

```bash
# Start the backend
python backend/app.py

# Visit in browser
http://localhost:5000/docs
```

You should see an API documentation page.

---

## 🚢 Deployment

### Deploying to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Services**
   - Create a new **Web Service** for backend
   - Create a new **Static Site** for frontend
   - Create a **MongoDB** database (or use MongoDB Atlas)

3. **Set Environment Variables** on Render:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET_KEY=<generate-new-secret>
   SECRET_KEY=<generate-new-secret>
   CORS_ORIGINS=https://your-frontend-url.com
   ```

4. **Update Frontend `.env`**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy!** 🎉

---

## 🛠️ Development Workflow

### Recommended Development Flow

1. ✅ API docs with Jinja2 template (`/docs` route)
2. ✅ Use test seeder for rapid development (`seed_test.py`)
3. ✅ Develop API endpoints
4. ✅ Build and connect frontend
5. ✅ Switch to full seeder for realistic data (`seed.py`)
6. ✅ Secure routes with JWT authentication
7. ✅ Deploy with Docker

### Building for Production

**Backend:**
```bash
# Backend is production-ready as-is
# Just ensure FLASK_ENV=production in .env
```

**Frontend:**
```bash
cd frontend
npm run build
# Outputs to frontend/dist/
```

---

## 🔒 Security Notes

- 🔑 JWT tokens are stored client-side (consider httpOnly cookies for production)
- 🚫 Never commit `.env` files with real secrets
- 🔐 Generate strong secrets for production using `python -c "import secrets; print(secrets.token_hex(32))"`
- 🛡️ Admin routes are protected by JWT authentication
- ⚠️ This is a learning project - additional security measures needed for production

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Denis Kramer**
- GitHub: [@HolyDen](https://github.com/HolyDen)

---

## 🙏 Acknowledgments

- Flask documentation and community
- React and Vite teams
- MongoDB for excellent NoSQL database
- All contributors and testers

---

## 📞 Support

If you have any questions or run into issues:

- 🐛 [Open an issue](https://github.com/HolyDen/supermarket-app/issues)
- 💬 [Discussions](https://github.com/HolyDen/supermarket-app/discussions)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and ☕

</div>