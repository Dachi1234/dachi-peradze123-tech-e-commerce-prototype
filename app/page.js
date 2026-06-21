'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarDisplay } from '@/components/StarRating';
import { useToast } from '@/components/Toast';
import { SiteHeader } from '@/components/SiteHeader';

// Category filter — dark theme pills
function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'phone', label: 'Phones' },
    { id: 'laptop', label: 'Laptops' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((cat) => {
        const active = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={
              active
                ? 'px-5 py-2 rounded-full text-sm font-medium bg-blue-500 text-white transition'
                : 'px-5 py-2 rounded-full text-sm font-medium bg-transparent text-gray-300 border border-[#2a2a2a] hover:border-gray-500 hover:text-white transition'
            }
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

// Product Card — dark theme, clickable
function ProductCard({ product }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="group cursor-pointer bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#3a3a3a] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-200"
    >
      <div className="relative aspect-square bg-[#141414] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <span className="absolute left-3 bottom-3 bg-green-950 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-2 truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <StarDisplay
            rating={parseFloat(product.avgRating || 0)}
            count={parseInt(product.ratingCount || 0)}
          />
          <span className="text-white font-bold text-lg">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
        <p className="text-gray-400">No products match your filter.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === 'all' ? true : p.category === selectedCategory
    )
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <SiteHeader search={search} onSearchChange={setSearch} />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
}
