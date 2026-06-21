'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { StarDisplay, StarInput } from '@/components/StarRating';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';
import { useToast } from '@/components/Toast';

function parseSpecs(description) {
  if (!description) return [];
  // Try splitting on bullets, semicolons, or pipes; fall back to sentence splits.
  const candidates = description
    .split(/[•\u2022]|;|\||\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (candidates.length >= 2) return candidates;

  // Otherwise split on ". " keeping fragments
  return description
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [adding, setAdding] = useState(false);

  // Rating UI
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load product');
      }
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error('Error loading product:', err);
      showToast('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      showToast(`Added "${product.name}" to cart`);
    } catch (err) {
      showToast(err.message || 'Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }
    setSubmittingRating(true);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId, stars: selectedRating }),
      });
      if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
        return;
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Failed to submit rating');
      }
      showToast('Thanks for rating!');
      setShowRatingInput(false);
      setSelectedRating(0);
      await fetchProduct();
    } catch (err) {
      showToast(err.message || 'Failed to submit rating', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111]">
        <SiteHeader />
        <div className="flex items-center justify-center py-32">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#111111]">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
          <p className="text-gray-400 mb-6">
            The product you're looking for doesn't exist or was removed.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            Back to store
          </a>
        </div>
      </div>
    );
  }

  const avgRating = parseFloat(product.avgRating || 0);
  const ratingCount = parseInt(product.ratingCount || 0);
  const specs = parseSpecs(product.description);

  return (
    <div className="min-h-screen bg-[#111111]">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/" className="hover:text-white transition">
            Home
          </a>
          <span className="mx-2 text-gray-600">/</span>
          <a
            href={`/?category=${product.category}`}
            className="hover:text-white transition capitalize"
          >
            {product.category}
          </a>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: image */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden p-6">
            <div className="aspect-square w-full flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: details */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="bg-green-950 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-5">{product.name}</h1>

            <p className="text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <StarDisplay rating={avgRating} count={ratingCount} showCount={false} />
              <span className="text-white font-semibold">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="border-t border-[#2a2a2a] my-2" />

            <div className="my-8">
              <div className="text-4xl font-bold text-white">
                ${parseFloat(product.price).toFixed(2)}
              </div>
            </div>

            {specs.length > 0 && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Specifications
                </h3>
                <ul className="space-y-3">
                  {specs.map((s, i) => (
                    <li
                      key={i}
                      className="text-gray-400 text-sm flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition mb-6"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>

            {/* Rating section */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Rate this product
              </h3>
              {!showRatingInput ? (
                <button
                  onClick={() => {
                    if (!user) {
                      router.push(
                        `/login?redirect=${encodeURIComponent(`/products/${productId}`)}`
                      );
                      return;
                    }
                    setShowRatingInput(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                >
                  {user ? 'Leave a rating' : 'Login to rate'}
                </button>
              ) : (
                <div>
                  <StarInput value={selectedRating} onChange={setSelectedRating} />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSubmitRating}
                      disabled={selectedRating === 0 || submittingRating}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      {submittingRating ? 'Submitting...' : 'Submit rating'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRatingInput(false);
                        setSelectedRating(0);
                      }}
                      className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
