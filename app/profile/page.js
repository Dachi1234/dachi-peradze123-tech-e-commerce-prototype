'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { StarDisplay } from '@/components/StarRating';

function ProfileHeader({ username }) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
          <a
            href="/"
            className="text-green-600 hover:text-green-700 font-medium transition"
          >
            Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}

function RatingsList({ ratings }) {
  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <p className="text-gray-500 text-lg">You haven't rated any products yet</p>
        <p className="text-gray-400 mt-2">Start browsing and rate products you like!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div className="flex items-start p-4 space-x-4">
            <div className="flex-shrink-0">
              <img
                src={rating.productImageUrl}
                alt={rating.productName}
                className="w-24 h-24 object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <span className="text-xs font-semibold text-green-600 uppercase">
                  {rating.productCategory}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {rating.productName}
              </h3>
              <div className="mb-2">
                <p className="text-sm text-gray-500 mb-1">Your rating:</p>
                <StarDisplay rating={rating.stars} showCount={false} />
              </div>
              {rating.createdAt && (
                <p className="text-sm text-gray-400">
                  Rated on {new Date(rating.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfileHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader username={profileData.username} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profileData.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.username}
              </h2>
              <p className="text-gray-600">
                {profileData.ratings.length} {profileData.ratings.length === 1 ? 'rating' : 'ratings'}
              </p>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">My Ratings</h3>
          <RatingsList ratings={profileData.ratings} />
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
}
