const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Initialize database tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
  )`);

  // Cart items table
  db.run(`CREATE TABLE cart_items (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products (id)
  )`);

  // Insert mock products with real image URLs
  const products = [
    { 
      id: '1', 
      name: 'Wireless Headphones', 
      price: 99.99, 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', 
      description: 'High-quality wireless headphones with noise cancellation' 
    },
    { 
      id: '2', 
      name: 'Smart Watch', 
      price: 199.99, 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', 
      description: 'Feature-rich smartwatch with health monitoring' 
    },
    { 
      id: '3', 
      name: 'Laptop Backpack', 
      price: 49.99, 
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', 
      description: 'Durable laptop backpack with multiple compartments' 
    },
    { 
      id: '4', 
      name: 'Bluetooth Speaker', 
      price: 79.99, 
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', 
      description: 'Portable Bluetooth speaker with excellent sound quality' 
    },
    { 
      id: '5', 
      name: 'Phone Case', 
      price: 19.99, 
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop', 
      description: 'Protective phone case with stylish design' 
    },
    { 
      id: '6', 
      name: 'USB-C Cable', 
      price: 14.99, 
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', 
      description: 'Fast charging USB-C cable, 6ft length' 
    },
    { 
      id: '7', 
      name: 'Wireless Mouse', 
      price: 29.99, 
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', 
      description: 'Ergonomic wireless mouse with precision tracking' 
    },
    { 
      id: '8', 
      name: 'Desk Lamp', 
      price: 39.99, 
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop', 
      description: 'LED desk lamp with adjustable brightness' 
    }
  ];

  const stmt = db.prepare("INSERT INTO products (id, name, price, image, description) VALUES (?, ?, ?, ?, ?)");
  products.forEach(product => {
    stmt.run(product.id, product.name, product.price, product.image, product.description);
  });
  stmt.finalize();
});

// Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/cart - Get cart items with total
app.get('/api/cart', (req, res) => {
  db.all(`
    SELECT ci.id, ci.productId, ci.quantity, p.name, p.price, p.image
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      items: rows,
      total: parseFloat(total.toFixed(2)),
      itemCount: rows.reduce((count, item) => count + item.quantity, 0)
    });
  });
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists
  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    db.get("SELECT * FROM cart_items WHERE productId = ?", [productId], (err, existingItem) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        db.run(
          "UPDATE cart_items SET quantity = ? WHERE productId = ?",
          [newQuantity, productId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Cart updated successfully', id: existingItem.id });
          }
        );
      } else {
        // Add new item
        const id = uuidv4();
        db.run(
          "INSERT INTO cart_items (id, productId, quantity) VALUES (?, ?, ?)",
          [id, productId, quantity],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Item added to cart', id });
          }
        );
      }
    });
  });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM cart_items WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

// POST /api/checkout - Mock checkout
app.post('/api/checkout', (req, res) => {
  const { customerInfo } = req.body;

  if (!customerInfo || !customerInfo.name || !customerInfo.email) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }

  // Get current cart total
  db.all(`
    SELECT ci.quantity, p.price, p.name
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `, (err, items) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = `ORD-${Date.now()}`;

    // Clear cart after successful checkout
    db.run("DELETE FROM cart_items", (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const receipt = {
        orderId,
        customerInfo,
        items,
        total: parseFloat(total.toFixed(2)),
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      res.json(receipt);
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});