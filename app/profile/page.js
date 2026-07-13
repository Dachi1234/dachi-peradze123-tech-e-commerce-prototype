'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { StarDisplay } from '@/components/StarRating';
import { SiteHeader } from '@/components/SiteHeader';

function RatingsList({ ratings }) {
  if (ratings.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
        <svg
          className="w-20 h-20 mx-auto text-gray-700 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <p className="text-gray-300 text-lg">You haven't rated any products yet</p>
        <p className="text-gray-500 mt-2">Browse the store and rate products you like.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <a
          key={rating.id}
          href={`/products/${rating.productId}`}
          className="block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition"
        >
          <div className="flex items-start p-4 gap-4">
            <img
              src={rating.productImageUrl}
              alt={rating.productName}
              className="w-24 h-24 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1">
                {rating.productCategory}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {rating.productName}
              </h3>
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Your rating:</p>
                <StarDisplay rating={rating.stars} showCount={false} />
              </div>
              {rating.createdAt && (
                <p className="text-xs text-gray-500">
                  Rated on{' '}
                  {new Date(rating.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function ProfileContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (authLoading) return;
      if (!user) {
        router.push('/');
        return;
      }
      try {
        const response = await fetch('/api/profile');
        if (response.status === 401) {
          router.push('/');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111]">
        <SiteHeader showSearch={false} />
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="bg-red-950/40 border border-red-900 rounded-xl p-4 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <SiteHeader showSearch={false} />

      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* User info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-gray-900 text-2xl font-bold">
                {profileData.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {profileData.username}
              </h2>
              <p className="text-gray-400 text-sm">
                {profileData.ratings.length}{' '}
                {profileData.ratings.length === 1 ? 'rating' : 'ratings'}
              </p>
            </div>
          </div>
        </div>

        {/* Ratings list */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">My Ratings</h3>
          <RatingsList ratings={profileData.ratings} />
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
