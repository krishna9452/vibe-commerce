import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

// Fallback images in case primary images fail
const FALLBACK_IMAGES = {
  '1': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
  '2': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
  '3': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  '4': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
  '5': 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop',
  '6': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
  '7': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
  '8': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop'
};

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [activeView, setActiveView] = useState('products');
  const [checkoutInfo, setCheckoutInfo] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image error handler with fallback
  const handleImageError = (e, productId) => {
    console.log(`Image failed to load for product ${productId}, using fallback`);
    const fallbackImage = FALLBACK_IMAGES[productId] || 'https://via.placeholder.com/300x300/667eea/ffffff?text=Product+Image';
    e.target.src = fallbackImage;
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please check if the backend server is running.');
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE}/cart`, { productId, quantity: 1 });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart. Please try again.');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart. Please try again.');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/checkout`, {
        customerInfo: checkoutInfo
      });
      setReceipt(response.data);
      setCart({ items: [], total: 0, itemCount: 0 });
      setCheckoutInfo({ name: '', email: '' });
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
    setActiveView('products');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Vibe Commerce</h1>
        <nav className="nav-tabs">
          <button 
            className={`tab ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('products');
              clearError();
            }}
          >
            Products
          </button>
          <button 
            className={`tab ${activeView === 'cart' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('cart');
              clearError();
            }}
          >
            Cart ({cart.itemCount})
          </button>
        </nav>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      <main className="main-content">
        {activeView === 'products' && (
          <div className="products-view">
            <h2>Our Products</h2>
            {products.length === 0 && !error ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => handleImageError(e, product.id)}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product.id)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'cart' && (
          <div className="cart-view">
            <h2>Shopping Cart</h2>
            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button 
                  className="continue-shopping"
                  onClick={() => setActiveView('products')}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="cart-item-image"
                        onError={(e) => handleImageError(e, item.productId)}
                        loading="lazy"
                      />
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p>${item.price} x {item.quantity}</p>
                      </div>
                      <div className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="total-section">
                    <h3>Total: ${cart.total.toFixed(2)}</h3>
                    <p className="item-count">{cart.itemCount} item(s) in cart</p>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={() => setActiveView('checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeView === 'checkout' && (
          <div className="checkout-view">
            <h2>Checkout</h2>
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  value={checkoutInfo.name}
                  onChange={(e) => setCheckoutInfo({...checkoutInfo, name: e.target.value})}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={checkoutInfo.email}
                  onChange={(e) => setCheckoutInfo({...checkoutInfo, email: e.target.value})}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name}</span>
                    <span>{item.quantity} x ${item.price}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ${cart.total.toFixed(2)}</strong>
                </div>
              </div>
              <div className="checkout-actions">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={() => setActiveView('cart')}
                >
                  Back to Cart
                </button>
                <button 
                  type="submit" 
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order - $${cart.total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {receipt && (
        <div className="receipt-modal">
          <div className="receipt-content">
            <div className="receipt-header">
              <h2>🎉 Order Confirmed!</h2>
              <p>Thank you for your purchase!</p>
            </div>
            <div className="receipt-details">
              <div className="receipt-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {receipt.orderId}</p>
                <p><strong>Customer:</strong> {receipt.customerInfo.name}</p>
                <p><strong>Email:</strong> {receipt.customerInfo.email}</p>
                <p><strong>Order Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
              </div>
              
              <div className="receipt-section">
                <h4>Items Ordered</h4>
                {receipt.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.quantity} x ${item.price}</span>
                    <span className="item-total">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="receipt-total">
                <strong>Total Amount: ${receipt.total.toFixed(2)}</strong>
              </div>
            </div>
            <button className="close-receipt-btn" onClick={closeReceipt}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;