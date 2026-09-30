import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { 
  Menu, 
  X, 
  PlusCircle, 
  User, 
  LogOut,
  LayoutDashboard,
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Tv,
  MessageSquare,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import notificationService from '../services/notificationService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Notifications State (Phase 19 Examples)
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'booking_request',
      title: 'New Booking Request Received',
      message: 'Client Rahul Sharma requested Pune LED Screen (10 Oct – 25 Oct, 15 days).',
      time: '10 mins ago',
      isRead: false,
      link: '/advertiser/dashboard?tab=requests'
    },
    {
      id: 'n2',
      type: 'booking_approved',
      title: 'Your booking has been approved',
      message: 'Your campaign on FC Road High Street Unipole is confirmed.',
      time: '2 hours ago',
      isRead: false,
      link: '/client/dashboard?tab=bookings'
    },
    {
      id: 'n3',
      type: 'new_message',
      title: 'You have a new message',
      message: 'Apex Media DOOH: "Yes, it is available for Diwali."',
      time: '3 hours ago',
      isRead: true,
      link: '/messages'
    },
  ]);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Boards', path: '/explore' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'advertiser') return '/advertiser/dashboard';
    return '/client/dashboard';
  };

  const getRoleBadge = () => {
    if (user?.role === 'admin') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
          Admin
        </span>
      );
    }
    if (user?.role === 'advertiser') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
          Board Owner
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
        Client
      </span>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' 
        : 'bg-white border-b border-slate-100 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <Logo size="md" variant="horizontal" theme="light" showTagline={false} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50/80 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Messages Link (Phase 17) */}
                <Link
                  to="/messages"
                  title="Messages & Inquiries"
                  className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                </Link>

                {/* Notifications Bell Dropdown (Phase 19) */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    title="Notifications"
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Popover */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-50">
                      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-orange-400" />
                          <span className="text-xs font-bold">Notifications</span>
                        </div>
                        {unreadNotifsCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-blue-300 hover:underline font-semibold cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link}
                            onClick={() => setIsNotifOpen(false)}
                            className={`p-3.5 block transition-colors hover:bg-slate-50 ${
                              !n.isRead ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {n.type === 'booking_approved' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              ) : n.type === 'booking_request' ? (
                                <Zap className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                              ) : (
                                <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user?.name}</div>
                    <div>{getRoleBadge()}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Log Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/register?role=advertiser"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-orange-500" />
                  <span>List a Board</span>
                </Link>

                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Get Started
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pb-4 border-b border-slate-100">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 space-y-2.5">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[11px] text-slate-500">{user?.email}</div>
                  </div>
                  {getRoleBadge()}
                </div>

                <Link
                  to={getDashboardPath()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/register?role=advertiser"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
                >
                  <PlusCircle className="w-4 h-4 text-orange-500" />
                  <span>List Your Board (Owners)</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
