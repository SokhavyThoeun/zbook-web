/**
 * Profile Page
 * Lets signed-in users view and update their account details
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, MapPin, Phone, Save, User, UserCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const emptyProfile = {
  username: '',
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  city: '',
};

export default function ProfilePage() {
  const router = useRouter();
  const { token, user, init, updateProfile } = useAuthStore();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const loadProfile = async () => {
      const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setError('');
        const response = await authAPI.getProfile();
        setProfile({ ...emptyProfile, ...response.data.data });
      } catch (profileError) {
        const fallbackUser = user || (typeof window !== 'undefined' && localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user'))
          : null);

        if (fallbackUser) {
          setProfile({ ...emptyProfile, ...fallbackUser });
        } else {
          setError(profileError.response?.data?.message || 'Could not load your profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const result = await updateProfile({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      city: profile.city,
    });

    if (result.success) {
      setSuccess('Profile updated successfully.');
      const response = await authAPI.getProfile();
      setProfile({ ...emptyProfile, ...response.data.data });
    } else {
      setError(result.error || 'Could not update your profile.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!token && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <UserCircle className="mx-auto mb-4 h-16 w-16 text-purple-500" />
          <h1 className="mb-2 text-3xl font-bold gradient-text">Profile</h1>
          <p className="mb-6 text-gray-600">Please login to view and update your profile.</p>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-bold text-white gradient-btn"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your Z Book account details.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700">
                {(profile.fullName || profile.username || 'Z').slice(0, 1).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.fullName || profile.username}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-purple-500" />
                <span>{profile.username || 'No username'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="break-all">{profile.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span>{profile.city || 'No city set'}</span>
              </div>
            </div>
          </aside>

          <section className="rounded-xl bg-white p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Full Name</span>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Phone Number</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+855..."
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">City</span>
                  <input
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Phnom Penh"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Address</span>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Street, district, province"
                  />
                </label>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {success}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white gradient-btn disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/orders')}
                  className="rounded-lg border border-purple-200 px-6 py-3 font-bold text-purple-700 hover:bg-purple-50 smooth-transition"
                >
                  View Orders
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
