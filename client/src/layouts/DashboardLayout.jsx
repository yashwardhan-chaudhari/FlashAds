import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Bell, 
  User, 
  Zap, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function DashboardLayout({
  roleTitle,
  roleBadgeColor = 'blue',
  navItems = [],
  activeTab,
  onSelectTab,
  children
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row selection:bg-orange-500 selection:text-white">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo size="sm" variant="horizontal" theme="dark" showTagline={false} />
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
            roleBadgeColor === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {roleTitle}
          </span>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 flex flex-col h-full justify-between">
          
          <div>
            {/* Logo in Sidebar */}
            <div className="pb-6 border-b border-slate-800/80 flex items-center justify-between">
              <Link to="/" className="inline-block">
                <Logo size="md" variant="horizontal" theme="dark" showTagline={false} />
              </Link>
            </div>

            {/* User Profile Card in Sidebar */}
            <div className="my-5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 ${
                roleBadgeColor === 'orange' 
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/20' 
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/20'
              }`}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="font-bold text-xs text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                <span className={`inline-block mt-1 px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                  roleBadgeColor === 'orange' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {roleTitle}
                </span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Main Menu
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.path && !item.isTab) {
                        navigate(item.path);
                      } else {
                        onSelectTab(item.id);
                      }
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? roleBadgeColor === 'orange'
                          ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                          : 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        ></div>
      )}

      {/* Main Dashboard Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">{roleTitle} Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-white capitalize">{activeTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
            >
              <span>Explore Marketplace</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Node: Pune Central</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
}
