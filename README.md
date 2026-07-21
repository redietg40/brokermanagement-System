FindBroker — Multi-Category Broker Management & Marketplace System

[Node.js](https://nodejs.org/) | [Express.js](https://expressjs.com/) | [Prisma](https://www.prisma.io/) | [PostgreSQL](https://www.postgresql.org/) | [MIT License](#license)

FindBroker is a full-stack, enterprise-grade broker management platform and multi-category marketplace designed to connect verified brokers with property buyers, car shoppers, and consumers across Ethiopia. The platform features role-based access control, broker license verification, real-time listing approval workflows, category search filters, and customer review management.

-------------------------------------------------------------------------------

Table of Contents

- Key Features
- Technology Stack
- Project Structure
- Getting Started
- Default Credentials
- System Screenshots
- License

-------------------------------------------------------------------------------

Key Features

Multi-Role Authentication & Access Control

- System Administrator Console: Supervise brokers, verify business licenses, review and approve/reject item listings, and monitor platform activity.
- Broker Portal: Secure dashboard for brokers to register, upload business licenses, create new listings, manage active listings, and track views.
- Public Customer Portal: Browse approved listings, view broker details, filter items by category, and submit customer reviews.

Multi-Category Marketplace

Supports diverse marketplace categories with specialized listing criteria:

- Real Estate (Villas, Apartments, Commercial Spaces, Land)
- Automotive (Cars, SUV, Trucks, Motorbikes)
- Electronics & Computers
- Fashion & Apparel
- Food & Beverage
- Agriculture & Livestock
- Services, Health, Education, Construction, and more

Admin Listing Approval Workflow

- All new broker listings start in pending status.
- System Admin can review details and Approve (publish to marketplace) or Reject/Revoke listings in real-time.
- Advanced administrative table filters by Category, Listing Status (Pending, Approved, Rejected), and Keyword Search.

Customer Reviews & Testimonials

- Live customer review submission with interactive star rating (1-5 Stars), customer role tags, and review comments.
- Dynamic responsive carousel for displaying client experiences.

Search & Smart Category Normalization

- Category query filter matching (browse.html?category=real-estate).
- Sorting by Newest, Price (Low/High), Name (A-Z), and Broker Rating.

-------------------------------------------------------------------------------

Technology Stack

Layer                | Technology
---------------------|-----------------------------------------------------------
Frontend             | HTML5, Vanilla CSS3, JavaScript (ES6+ Async/Await), FontAwesome 6, Google Fonts
Backend API          | Node.js, Express.js (RESTful API), CORS
Database & ORM       | PostgreSQL, Prisma ORM v5
Authentication       | Passwords hashed with bcryptjs, LocalStorage session handling
Architecture         | Client-Server Architecture with unified API data layer (db.js)

-------------------------------------------------------------------------------

Project Structure

brokerproject/
|
+-- backend/
|   +-- prisma/
|   |   +-- schema.prisma        # Prisma Database Schema (User, Broker, Admin, Listing, Review)
|   +-- routes/
|   |   +-- admin.js             # Admin authentication & broker/listing verification APIs
|   |   +-- auth.js              # User & Broker registration/login APIs
|   |   +-- listings.js          # Listing CRUD & category filtering APIs
|   |   +-- reviews.js           # Customer review submission & listing APIs
|   +-- .env                     # Database connection string & environment variables
|   +-- server.js                # Express app entry point & DB seeder
|   +-- package.json             # Backend dependencies
|
+-- index.html                   # Homepage
+-- browse.html                  # Public Browse & Category Filter page
+-- categories.html              # Category overview grid page
+-- reviews.html                 # Customer Reviews & interactive submission modal
+-- about.html                   # About & contact page
+-- admin-panel.html             # System Administrator dashboard UI
+-- admin-panel.js               # Admin panel state & table controller
+-- broker-dashboard.html        # Broker listing management UI
+-- broker-dashboard.js          # Broker dashboard controller
+-- db.js                        # Unified Frontend-to-Backend API client library
+-- script.js                    # Global marketplace interactivity & carousel logic
+-- styles.css                   # Main platform CSS stylesheet
+-- README.md                    # Project documentation

-------------------------------------------------------------------------------

Getting Started

Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database installed and running locally on port 5432

Installation & Setup

1. Clone the Repository

   git clone https://github.com/redietg40/brokermanagement-System.git
   cd brokermanagement-System

2. Setup Backend Environment

   Navigate to the backend folder and create a .env file:

   PORT=5000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/brokerdb?schema=public"

3. Install Dependencies

   cd backend
   npm install

4. Synchronize PostgreSQL Database with Prisma

   npx prisma db push
   npx prisma generate

5. Start the Backend Server

   npm run dev
   or
   node server.js

   The server will run on http://localhost:5000 and automatically seed default administrator credentials (admin@findbroker.com / admin123) and initial mock brokers/listings.

6. Launch Frontend

   Open index.html or run using VS Code Live Server (http://127.0.0.1:5501).

-------------------------------------------------------------------------------

Default Credentials

Role               | Email                     | Password    | Access URL
-------------------|---------------------------|-------------|------------------------------------------
System Admin       | admin@findbroker.com      | admin123    | http://127.0.0.1:5501/admin-panel.html
Verified Broker    | ahmed@findbroker.com      | password123 | http://127.0.0.1:5501/broker-login.html

-------------------------------------------------------------------------------

System Screenshots

Page               | Description
-------------------|-----------------------------------------------------------
Admin Panel        | Approve/Reject broker applications and listing requests
Browse Marketplace | Multi-category item listings with price and status filters
Customer Reviews   | Interactive review carousel & submission modal

-------------------------------------------------------------------------------

License

This project is licensed under the MIT License.

-------------------------------------------------------------------------------

Developed with love for Ethiopia's Brokerage & Marketplace Industry
