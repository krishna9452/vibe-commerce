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

## 📁 Project Structure
 ```text
 ecom-cart/
├── backend/
│   ├── package.json
│   ├── server.js          # Main server file
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── README.md
└── README.md
```
## 🎯 Functionality
### Product Catalog
- View 8 sample products with images, descriptions, and prices
- Add products to shopping cart
- Responsive grid layout
  
### Shopping Cart
- View all added items with quantities
- Remove items from cart
- Real-time total calculation
- Item count in navigation

### Checkout Process
- Customer information form (name & email)
- Order summary review
- Mock payment processing
- Order confirmation with receipt

## 🎨 UI/UX Features
- Modern Design: Clean, professional e-commerce interface
- Responsive: Works on desktop, tablet, and mobile devices
- Smooth Animations: Hover effects and transitions
- Error Handling: User-friendly error messages
- Loading States: Visual feedback during operations

## 📊 Database Schema
### Products Table
- ```id``` (TEXT PRIMARY KEY)
- ```name``` (TEXT NOT NULL)
- ```price``` (REAL NOT NULL)
- ```image``` (TEXT)
- ```description``` (TEXT)

### Cart Items Table
- ```id``` (TEXT PRIMARY KEY)
- ```productId``` (TEXT NOT NULL)
- ```quantity``` (INTEGER NOT NULL)
- ```addedAt``` (DATETIME DEFAULT CURRENT_TIMESTAMP)

## 🔧 Development
### Backend Development
```bash
cd backend
npm run dev  
```
### Frontend Development
```bash
cd frontend
npm start
```



