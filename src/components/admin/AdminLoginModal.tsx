import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
  Feather,
  KeyRound,
} from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { login, settings } = useNews();
  const [portalMode, setPortalMode] = useState<'admin' | 'editor'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Switch between Admin & Editor mode
  const handleSelectMode = (mode: 'admin' | 'editor') => {
    setPortalMode(mode);
    setError('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('ইমেইল অ্যাড্রেস প্রদান করা আবশ্যক।');
      return;
    }

    if (!password.trim()) {
      setError('পাসওয়ার্ড প্রদান করা আবশ্যক। পাসওয়ার্ড ছাড়া প্যানেলে প্রবেশ অসম্ভব।');
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email.trim(), password.trim());
      if (ok) {
        if (onSuccess) onSuccess();
      } else {
        setError('প্রদত্ত ইমেইল অথবা গোপন পাসওয়ার্ড সঠিক নয়। সঠিক তথ্য ছাড়া এক্সেস অসম্ভব।');
      }
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে। গোপন পাসওয়ার্ড যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Brand & Security Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-rose-900/40 border border-rose-800 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">
            {settings?.siteName || 'সত্যবাণী'} CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            নিরাপদ সম্পাদকীয় ও প্রশাসন নিয়ন্ত্রণ পোর্টাল
          </p>
        </div>

        {/* Role Portal Selection Tabs */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            পোর্টাল নির্বাচন করুন (Select Portal)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSelectMode('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                portalMode === 'admin'
                  ? 'bg-rose-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>👑 Admin প্যানেল</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('editor')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                portalMode === 'editor'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>✍️ Editor ইন্টারফেস</span>
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] text-slate-400">
              {portalMode === 'admin'
                ? '👑 সম্পূর্ণ অ্যাডমিন অ্যাক্সেস (সেটিংস, বিজ্ঞাপন, ডিপ্লয়মেন্ট ও কনফিগারেশন)'
                : '✍️ সংবাদ সম্পাদক অ্যাক্সেস (সংবাদ লেখা, সম্পাদনা, ব্রেকিং নিউজ ও পোস্ট রিচ)'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-xl flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {portalMode === 'admin' ? 'প্রশাসক ইমেইল (Admin Email)' : 'সম্পাদক ইমেইল (Editor Email)'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ইমেইল অ্যাড্রেস লিখুন"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-800 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">
                গোপন পাসওয়ার্ড (Secret Password)
              </label>
              <span className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> সুরক্ষিত
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="গোপন পাসওয়ার্ড লিখুন"
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-800 font-mono tracking-wider transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                portalMode === 'admin'
                  ? 'bg-rose-900 hover:bg-rose-950'
                  : 'bg-blue-900 hover:bg-blue-950'
              }`}
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : portalMode === 'admin' ? 'Admin প্যানেলে প্রবেশ করুন' : 'Editor ইন্টারফেসে প্রবেশ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Security Policy Reminder */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            🔒 <strong>নিরাপত্তা নীতি:</strong> পাসওয়ার্ড সম্পূর্ণ এনক্রিপ্টেড ও গোপন রাখা হয়েছে। সঠিক পাসওয়ার্ড ছাড়া প্যানেলে প্রবেশ সম্পূর্ণ অসম্ভব।
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-3 text-xs text-slate-400 hover:text-slate-200 text-center transition"
          >
            মূল ওয়েবসাইটে ফিরে যান
          </button>
        )}
      </div>
    </div>
  );
};
