import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import BoardDetails from './pages/BoardDetails';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/dashboards/ClientDashboard';
import AdvertiserDashboard from './pages/dashboards/AdvertiserDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import { Zap, ArrowLeft } from 'lucide-react';

function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'advertiser') return <Navigate to="/advertiser/dashboard" replace />;
  return <Navigate to="/client/dashboard" replace />;
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
        <Zap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm max-w-md mb-8">
        The billboard, page, or resource you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="boards/:id" element={<BoardDetails />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Role Dashboards wrapped with MainLayout & ProtectedRoute */}
            <Route
              path="client/dashboard"
              element={
                <ProtectedRoute allowedRoles={['client', 'admin']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="advertiser/dashboard"
              element={
                <ProtectedRoute allowedRoles={['advertiser', 'admin']}>
                  <AdvertiserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Aliases & Direct Redirects (Phase 27 Fixes) */}
            <Route path="dashboard" element={<DashboardRedirect />} />
            <Route path="client" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="advertiser" element={<Navigate to="/advertiser/dashboard" replace />} />
            <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="favorites" element={<Navigate to="/client/dashboard?tab=favorites" replace />} />
            <Route path="my-bookings" element={<Navigate to="/client/dashboard?tab=bookings" replace />} />
            <Route path="my-boards" element={<Navigate to="/advertiser/dashboard?tab=boards" replace />} />
            <Route path="add-board" element={<Navigate to="/advertiser/dashboard?tab=add" replace />} />
            <Route path="requests" element={<Navigate to="/advertiser/dashboard?tab=requests" replace />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
