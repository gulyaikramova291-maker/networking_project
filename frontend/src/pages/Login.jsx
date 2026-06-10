import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boxes, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@tekstilhub.uz', password: 'admin123' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Xush kelibsiz!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login xatolik. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-navy-600/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-navy-900 px-8 py-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                <Boxes className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-white text-2xl">TekstilHub<span className="text-gold-400">.uz</span></span>
            </Link>
            <p className="text-navy-400 text-sm mt-2">Hisobingizga kiring</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@tekstilhub.uz"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1.5">Parol</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-11"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Kirish...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Kirish <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-2">Demo hisob:</p>
              <p className="text-xs text-blue-600 font-mono">admin@tekstilhub.uz</p>
              <p className="text-xs text-blue-600 font-mono">admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-navy-500 text-sm mt-5">
          <Link to="/" className="text-navy-300 hover:text-white transition-colors">← Bosh sahifaga qaytish</Link>
        </p>
      </div>
    </div>
  );
}
