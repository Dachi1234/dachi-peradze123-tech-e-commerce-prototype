'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';

/**
 * Dark site header used across pages.
 *
 * Props:
 *  - search: string                  current search value (optional)
 *  - onSearchChange: (v) => void     when the search input changes (optional)
 *  - showSearch: boolean             default true; hides the search bar when false
 */
export function SiteHeader({ search = '', onSearchChange, showSearch = true }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-[#0f0f0f] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a
            href="/"
            className="text-xl font-bold text-white tracking-tight shrink-0"
          >
            TechStore
          </a>

          {/* Search */}
          {showSearch ? (
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-transparent focus:outline-none focus:border-[#3b82f6] transition"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <a
                  href="/profile"
                  className="hidden sm:inline text-sm text-gray-400 hover:text-white transition"
                >
                  {user.username}
                </a>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-white transition px-2 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition px-2 py-2"
              >
                Login
              </a>
            )}

            <button
              onClick={() => {
                if (!user) {
                  router.push('/login?redirect=/cart');
                  return;
                }
                router.push('/cart');
              }}
              className="relative flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              aria-label="View cart"
            >
              <svg
                className="w-4 h-4"
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
              <span>Cart</span>
              {count > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs font-bold rounded-full px-2 py-0.5">
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
