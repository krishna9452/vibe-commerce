# Vibe Commerce - Mock E-commerce Shopping Cart

A full-stack shopping cart application built with React frontend and Node.js/Express backend with SQLite database. This project demonstrates a complete e-commerce flow with product listing, cart management, and mock checkout functionality.

## 🚀 Features

### Backend
- RESTful API with Express.js
- SQLite database for data persistence
- Product management
- Shopping cart operations
- Mock checkout system
- Error handling and validation

### Frontend
- React-based responsive UI
- Product grid with add to cart functionality
- Shopping cart management
- Checkout form with order summary
- Order confirmation receipt
- Mobile-friendly design

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/cart` | Get cart items with total |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/checkout` | Process mock checkout |

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ecom-cart
   ```
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend server runs on http://localhost:5000
3. **Frontend Setup (in a new terminal)**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on http://localhost:3000
4. **Access the Application**
   Open your browser and navigate to http://localhost:3000
