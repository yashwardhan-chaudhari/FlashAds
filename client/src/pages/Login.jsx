import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building2, 
  Tv, 
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // 'client' | 'advertiser'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectByRole = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login') && !from.includes('/register')) {
      navigate(from, { replace: true });
      return;
    }

    if (userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (userRole === 'advertiser') {
      navigate('/advertiser/dashboard', { replace: true });
    } else {
      navigate('/client/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      redirectByRole(result.user.role);
    } else {
      setErrorMessage(result.message || 'Invalid email or password');
    }
  };

  const handleQuickDemo = (roleType) => {
    const res = demoLogin(roleType);
    if (res.success) {
      redirectByRole(res.user.role);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link to="/" className="inline-block mb-4">
          <Logo size="lg" variant="stacked" theme="dark" showTagline={true} />
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sign In to FlashAds
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Access your campaigns, booking requests, and billboard listings
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          
          {/* Role selection tab for UI guidance */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'client'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>I Want to Advertise</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('advertiser')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'advertiser'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>I Own Boards</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5 text-center">
              Instant 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('client')}
                className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 text-[11px] font-semibold text-center cursor-pointer transition-colors"
              >
                Client Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('advertiser')}
                className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-orange-400 border border-slate-800 text-[11px] font-semibold text-center cursor-pointer transition-colors"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[11px] font-semibold text-center cursor-pointer transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-orange-400 hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
