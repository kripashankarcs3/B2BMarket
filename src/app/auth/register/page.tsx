'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    accountType: 'buyer' as 'buyer' | 'supplier',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, company: formData.company || undefined, accountType: formData.accountType });
      router.push('/');
    } catch {
      setError('Registration failed. This email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-ink-50 to-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-600/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-400/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-[24px] elev-xl border border-ink-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-[10px] bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
            <p className="text-sm text-ink-400 mt-1">Join millions of businesses on B2BMarket</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-ink-50 rounded-[12px]">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, accountType: 'buyer' }))}
              className={`py-2.5 px-4 text-sm font-medium rounded-[10px] transition-smooth ${formData.accountType === 'buyer' ? 'bg-white text-ink-900 elev-sm' : 'text-ink-500 hover:text-ink-700'}`}
            >
              I&apos;m a Buyer
            </button>
            <button
              onClick={() => setFormData((prev) => ({ ...prev, accountType: 'supplier' }))}
              className={`py-2.5 px-4 text-sm font-medium rounded-[10px] transition-smooth ${formData.accountType === 'supplier' ? 'bg-white text-ink-900 elev-sm' : 'text-ink-500 hover:text-ink-700'}`}
            >
              I&apos;m a Supplier
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-[12px]"
              >
                {error}
              </motion.p>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User size={16} />}
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              icon={<Mail size={16} />}
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label="Company Name"
              type="text"
              placeholder="Your Company Ltd."
              icon={<Building2 size={16} />}
              value={formData.company}
              onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              icon={<Lock size={16} />}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1">
                  {showPassword ? <EyeOff size={16} className="text-ink-400" /> : <Eye size={16} className="text-ink-400" />}
                </button>
              }
              required
            />

            <Button type="submit" size="lg" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={18} />}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-4">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-brand-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
          </p>

          <p className="text-center text-sm text-ink-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
