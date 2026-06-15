'use client';

import { useStore } from '@/lib/useStore';
import { ArrowLeft, Save, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EditProfilePage() {
  const { user, setUser } = useStore();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        ...user!,
        fullName: formData.fullName,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
          <p className="text-white/60 mt-2">Update your profile information</p>
        </div>

        {/* Form Section */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <div className="space-y-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User size={18} className="text-purple-400" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Mail size={18} className="text-blue-400" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-white/40 mt-2">Email cannot be changed. Contact support if you need to update it.</p>
            </div>

            {/* Subscription Info */}
            <div className="bg-white/5 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Subscription Plan</h3>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Current Plan: <span className="text-white font-semibold capitalize">{user?.tier || 'Free'}</span></span>
                <Link href="/settings" className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                  Upgrade →
                </Link>
              </div>
            </div>

            {/* Success Message */}
            {saved && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-4 text-emerald-200 text-sm font-medium">
                ✓ Profile updated successfully
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Link href="/profile" className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-lg transition-colors text-center">
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-white mb-3">Need to change something else?</h3>
          <div className="space-y-2 text-sm text-white/60">
            <p>• To change your email, contact our support team</p>
            <p>• To view or delete your data, visit the Privacy Settings</p>
            <p>• To change your password, go to Settings → Security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
