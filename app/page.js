'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarDisplay, StarInput } from '@/components/StarRating';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';
import { useToast } from '@/components/Toast';
import { AuthModal } from '@/components/AuthModal';

// Header Component
function Header({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();

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
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 hidden sm:inline">
                  Hello, <span className="font-semibold">{user.username}</span>
                </span>
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Profile
                </a>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login?redirect=/cart');
                  return;
                }
                router.push('/cart');
              }}
              className="relative flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              aria-label="View cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
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
function ProductCard({ product, onAddToCart, onRatingSubmit, onLoginClick }) {
  const { user } = useAuth();
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) return;

    setIsSubmitting(true);
    await onRatingSubmit(product.id, selectedRating);
    setIsSubmitting(false);
    setShowRatingInput(false);
    setSelectedRating(0);
  };

  const handleRateClick = () => {
    if (!user) {
      onLoginClick();
    } else {
      setShowRatingInput(true);
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="aspect-square bg-gray-100">
        <img
          src={product.imageUrl}
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

        {/* Rating Display */}
        <div className="mb-3">
          <StarDisplay rating={parseFloat(product.avgRating || 0)} count={parseInt(product.ratingCount || 0)} />
          {!showRatingInput && (
            <button
              onClick={handleRateClick}
              className="text-green-600 text-sm hover:underline mt-1"
            >
              {user ? 'Rate this product' : 'Login to rate'}
            </button>
          )}
        </div>

        {/* Rating Input */}
        {showRatingInput && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Your rating:</p>
            <StarInput value={selectedRating} onChange={setSelectedRating} />
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0 || isSubmitting}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowRatingInput(false);
                  setSelectedRating(0);
                }}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Grid Component
function ProductGrid({ products, onAddToCart, onRatingSubmit, onLoginClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onRatingSubmit={onRatingSubmit}
          onLoginClick={onLoginClick}
        />
      ))}
    </div>
  );
}

// Home Content Component
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = async (product) => {
    if (!user) {
      // Redirect to login, return back to home so user can keep shopping
      router.push(`/login?redirect=${encodeURIComponent('/')}`);
      return;
    }
    try {
      await addToCart(product.id, 1);
      showToast(`Added "${product.name}" to cart`);
    } catch (err) {
      showToast(err.message || 'Failed to add to cart', 'error');
    }
  };

  const handleRatingSubmit = async (productId, stars) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          stars: stars,
        }),
      });

      if (response.ok) {
        // Refetch products to update the average rating
        const productsResponse = await fetch('/api/products');
        const updatedProducts = await productsResponse.json();
        setProducts(updatedProducts);
      } else if (response.status === 401) {
        // User not authenticated
        setAuthMode('login');
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onRatingSubmit={handleRatingSubmit}
          onLoginClick={handleLoginClick}
        />
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}
