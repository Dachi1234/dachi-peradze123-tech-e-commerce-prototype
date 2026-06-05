'use client';

import { useState } from 'react';
import { FakeComponent } from 'nonexistent-package-xyz-123';

// Mock product data
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'phone',
    price: 999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    description: 'Latest iPhone with A17 Pro chip'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phone',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    description: 'Premium Android flagship'
  },
  {
    id: 3,
    name: 'Google Pixel 8 Pro',
    category: 'phone',
    price: 899,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    description: 'Pure Android experience with AI features'
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    category: 'laptop',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    description: 'Powerful M3 Pro chip for professionals'
  },
  {
    id: 5,
    name: 'Lenovo ThinkPad X1 Carbon',
    category: 'laptop',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    description: 'Business-class ultrabook'
  },
  {
    id: 6,
    name: 'Dell XPS 15',
    category: 'laptop',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop',
    description: 'Stunning 4K display and performance'
  },
  {
    id: 7,
    name: 'iPhone 15',
    category: 'phone',
    price: 799,
    image: 'https://images.unsplash.com/photo-1592286927505-c80e8c6e8e2a?w=400&h=400&fit=crop',
    description: 'Excellent value flagship phone'
  },
  {
    id: 8,
    name: 'OnePlus 12',
    category: 'phone',
    price: 799,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    description: 'Flagship killer with fast charging'
  },
  {
    id: 9,
    name: 'HP Spectre x360',
    category: 'laptop',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    description: 'Premium 2-in-1 convertible'
  },
  {
    id: 10,
    name: 'ASUS ROG Zephyrus',
    category: 'laptop',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
    description: 'Gaming powerhouse laptop'
  }
];

// Header Component
function Header({ cartCount, onCartClick }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            onClick={onCartClick}
            className="relative flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// Category Filter Component
function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'phone', label: 'Phones' },
    { id: 'laptop', label: 'Laptops' }
  ];

  return (
    <div className="flex justify-center space-x-4 mb-8">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            selectedCategory === cat.id
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="aspect-square bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-green-600 uppercase">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Grid Component
function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// Cart Component
function Cart({ cartItems, products, onClose, onUpdateQuantity, onRemove }) {
  const getProduct = (productId) => products.find(p => p.id === productId);

  const total = cartItems.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => {
                  const product = getProduct(item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex items-center space-x-4 border-b pb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onRemove(item.productId)}
                            className="ml-4 text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        ${product.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-gray-900">${total}</span>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg">
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.productId === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { productId: product.id, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemove(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemove = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      </main>

      {showCart && (
        <Cart
          cartItems={cartItems}
          products={products}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
