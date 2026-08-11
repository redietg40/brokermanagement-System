<div align="center">

# 🏘️ FindBroker

![Node.js](https://img.shields.io/badge/Node.js-18.x-43853D.svg?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-404D59.svg?style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192.svg?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.x-3982CE.svg?style=flat&logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

*A full-stack, enterprise-grade broker management platform and multi-category marketplace for Ethiopia* ✨

[🚀 Live Demo](#) • [📖 Documentation](#-features) • [🛠️ Installation](#-quick-start) • [🤝 Contributing](#)

</div>

---

## 🌟 Features

### 🔐 **Multi-Role Authentication & Access Control**
- **System Administrator Console**: Supervise brokers, verify business licenses, review and approve/reject item listings in real-time.
- **Broker Portal**: Secure dashboard for brokers to register, upload business licenses, create new listings, manage active listings, and track views.
- **Public Customer Portal**: Browse approved listings, view broker details, filter items by category, and submit interactive star-rated reviews.

### 🛍️ **Multi-Category Marketplace**
- **Real Estate**: Villas, Apartments, Commercial Spaces, Land
- **Automotive**: Cars, SUVs, Trucks, Motorbikes
- **Consumer Goods**: Electronics, Computers, Fashion & Apparel, Food & Beverage
- **Industry & Services**: Agriculture, Livestock, Health, Education, Construction

### ⚙️ **Smart Search & Categorization**
- **Category Normalization**: Query filter matching (e.g., `?category=real-estate`).
- **Advanced Sorting**: Sort by Newest, Price (Low/High), Name (A-Z), and Broker Rating.
- **Admin Filters**: Advanced administrative table filters by Category, Listing Status (Pending, Approved, Rejected), and Keyword Search.

### 💬 **Customer Reviews & Testimonials**
- **Live Feedback**: Submit reviews with an interactive star rating (1-5 Stars).
- **Responsive Display**: Dynamic carousel for displaying verified client experiences.

---

## 🚀 Quick Start

### 🔧 **Local Development Setup**

```bash
# Clone the repository
git clone https://github.com/redietg40/brokermanagement-System.git
cd brokermanagement-System

# Setup Backend Environment
cd backend
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/brokerdb?schema=public"
```

```bash
# Install dependencies
npm install

# Synchronize PostgreSQL Database with Prisma
npx prisma db push
npx prisma generate

# Start the Backend Server
npm run dev
# Server runs on http://localhost:5000
```

### 🌐 **Launch Frontend**
Open `index.html` in your browser or run it using a local server extension like **VS Code Live Server** (usually runs on `http://127.0.0.1:5501`).

---

## 🗂️ Project Structure

```text
brokermanagement-System/
├── 📁 backend/
│   ├── 📁 prisma/
│   │   └── schema.prisma        # Prisma Database Schema 
│   ├── 📁 routes/
│   │   ├── admin.js             # Admin auth & verification APIs
│   │   ├── auth.js              # User & Broker registration APIs
│   │   ├── listings.js          # Listing CRUD & filtering APIs
│   │   └── reviews.js           # Customer review submission APIs
│   ├── .env                     # Environment variables
│   ├── server.js                # Express app entry point & DB seeder
│   └── package.json             # Backend dependencies
├── 📄 index.html                   # Homepage
├── 📄 browse.html                  # Public Browse & Category Filter page
├── 📄 categories.html              # Category overview grid page
├── 📄 reviews.html                 # Customer Reviews & interactive modal
├── 📄 admin-panel.html             # System Administrator dashboard UI
├── 📄 broker-dashboard.html        # Broker listing management UI
├── 📄 db.js                        # Unified Frontend-to-Backend API client
├── 📄 script.js                    # Global interactivity & carousel logic
└── 📄 styles.css                   # Main platform CSS stylesheet
```

---

## 🔑 Default Credentials

The server automatically seeds default administrator and verified broker credentials on first run:

| Role | Email | Password | Access URL |
| --- | --- | --- | --- |
| 🛡️ **System Admin** | `admin@findbroker.com` | `admin123` | `/admin-panel.html` |
| 💼 **Verified Broker** | `ahmed@findbroker.com` | `password123` | `/broker-login.html` |

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+), FontAwesome 6
- **Backend**: Node.js, Express.js (RESTful API), CORS
- **Database**: PostgreSQL, Prisma ORM v5
- **Security**: bcryptjs password hashing, LocalStorage session handling

---

<div align="center">
  <p>Developed with ❤️ for Ethiopia's Brokerage & Marketplace Industry</p>
  <p>This project is licensed under the <strong>MIT License</strong>.</p>
</div>
