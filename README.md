# E-commerce Application

This is a modern e-commerce application built with a decoupled architecture. It uses a **React (Vite)** frontend and a **Laravel** backend, utilizing a **MySQL** database.

## 🚀 Project Overview

This project is a complete e-commerce platform that allows users to browse products, add them to a cart, and place orders. It also includes an administrative panel to manage products, orders, and users.

## ✨ Main Features

- **User Authentication:** Registration, login, and secure session management using Laravel Sanctum.
- **Product Catalog:** Browse and view product details.
- **Shopping Cart:** Add, remove, and manage items in the cart.
- **Wishlist:** Save favorite products for later.
- **Order Management:** Place orders and view order history (Client Dashboard).
- **Admin Dashboard:** 
  - Manage products (Create, Read, Update, Delete)
  - Manage orders
  - Manage users/clients

## 🛠️ Technologies and Tools Used

### Frontend
- **React 19**
- **Vite** (Build tool)
- **React Router DOM** (Routing)
- **Axios** (API requests)
- **Lucide React** (Icons)
- **CSS** (Vanilla CSS for styling)

### Backend
- **PHP 8.2+**
- **Laravel 12**
- **Laravel Sanctum** (API Authentication)
- **MySQL** (Database)

## 📂 Project Structure

The project is divided into two main directories:

- `/frontend`: Contains the React application (UI/UX).
- `/backend`: Contains the Laravel API application (Business logic and database access).

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** and **npm** installed (for the frontend).
- **PHP** (>= 8.2) and **Composer** installed (for the backend).
- **MySQL** database server running (e.g., via MAMP, XAMPP, or natively).

## ⚙️ Installation & Setup

Clone the repository to your local machine, then follow the instructions for both backend and frontend.

### 1. Backend (Laravel) Configuration

Navigate to the backend directory:
```bash
cd backend
```

Install PHP dependencies:
```bash
composer install
```

Set up your environment variables:
1. Copy the `.env.example` file and rename it to `.env`.
   ```bash
   cp .env.example .env
   ```
2. Generate the application key:
   ```bash
   php artisan key:generate
   ```

**MySQL Database Configuration:**
Open the `.env` file in the `backend` directory and configure your database settings:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```
*(Make sure you have created an empty database in your MySQL server matching `your_database_name`)*

Run the database migrations (and seeders if applicable):
```bash
php artisan migrate
```

**Run the Backend Locally:**
```bash
php artisan serve
```
The backend API will be available at `http://localhost:8000`.

---

### 2. Frontend (React) Configuration

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory (if it doesn't exist) to store the API URL:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Run the Frontend Locally:**
```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## 🏗️ Build Instructions for Production

To build the frontend for production, run:
```bash
cd frontend
npm run build
```
This will generate a `dist` folder containing the optimized, minified static files ready for deployment.

## ⚠️ Important Notes

- Since this app uses Laravel Sanctum for API authentication, ensure that your `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` in the backend `.env` file are configured correctly if you run into CORS or session/cookie issues between the frontend and backend.
