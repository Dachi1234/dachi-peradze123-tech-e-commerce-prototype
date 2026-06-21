'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';
import { useToast } from '@/components/Toast';

function CartHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-gray-900">
          TechStore
        </a>
        <div className="flex items-center space-x-4">
          {user && (
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
          )}
          <a
            href="/"
            className="text-green-600 hover:text-green-700 font-medium transition"
          >
            Continue shopping
          </a>
          <div className="relative flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-semibold">{count}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuantityControl({ item, onChange, disabled }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onChange(Math.max(1, item.quantity - 1))}
        disabled={disabled || item.quantity <= 1}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-10 text-center font-semibold">{item.quantity}</span>
      <button
        onClick={() => onChange(item.quantity + 1)}
        disabled={disabled}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

function CartContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [authLoading, user, router]);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.productPrice) || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleQty = async (item, newQty) => {
    setBusy(true);
    try {
      await updateQuantity(item.id, newQty);
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (item) => {
    setBusy(true);
    try {
      await removeItem(item.id);
      showToast('Removed from cart');
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleClear = async () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    setConfirmingClear(false);
    setBusy(true);
    try {
      await clearCart();
      showToast('Cart cleared');
    } catch (err) {
      showToast(err.message || 'Failed to clear cart', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CartHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          {items.length > 0 && (
            confirmingClear ? (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Clear all items?</span>
                <button
                  onClick={handleClear}
                  disabled={busy}
                  className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setConfirmingClear(false)}
                  disabled={busy}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleClear}
                disabled={busy}
                className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Clear cart
              </button>
            )
          )}
        </div>

        {loading && items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <a
              href="/"
              className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Browse products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md divide-y">
              {items.map((item) => {
                const price = parseFloat(item.productPrice) || 0;
                const subtotal = price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4"
                  >
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-green-600 uppercase mb-1">
                        {item.productCategory}
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        ${price.toFixed(2)} each
                      </p>
                      <div className="mt-2">
                        <QuantityControl
                          item={item}
                          disabled={busy}
                          onChange={(qty) => handleQty(item, qty)}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        ${subtotal.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={busy}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order summary</h2>
              <div className="flex items-center justify-between text-gray-700 mb-2">
                <span>
                  Items (
                  {items.reduce((s, it) => s + it.quantity, 0)})
                </span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 mt-4 flex items-center justify-between">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                disabled
                title="Checkout is out of scope for this build"
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold opacity-60 cursor-not-allowed"
              >
                Checkout (coming soon)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}
