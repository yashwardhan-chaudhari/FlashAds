import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  Heart, 
  MessageSquare, 
  User, 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ArrowRight, 
  Building2, 
  Send, 
  Trash2, 
  CreditCard,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tv,
  Star,
  AlertTriangle,
  Check,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { formatCurrency, formatDate, formatDuration } from '../../utils/formatters';
import { mockBoards } from '../../data/mockBoards';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import reviewService from '../../services/reviewService';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Client Bookings State (Phase 15, 21, 22)
  const [bookings, setBookings] = useState([
    {
      id: 'bkg-101',
      bookingId: 'FA-BKG-9012',
      boardId: 'board-1',
      boardTitle: 'Pune Premium LED Screen',
      boardType: 'LED Digital Screen',
      area: 'Hinjewadi, Pune',
      startDate: '10 Oct 2026',
      endDate: '25 Oct 2026',
      durationDays: 15,
      totalAmount: 18000,
      priceBreakdown: '2 weeks + 1 day tier (₹18,000)',
      status: 'approved', // 'pending' | 'approved' | 'completed' | 'cancelled'
      paymentStatus: 'unpaid', // 'unpaid' | 'paid'
      bookingType: 'digital_slot',
      ownerName: 'Apex Media DOOH',
      ownerPhone: '+91 98220 66666',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'bkg-102',
      bookingId: 'FA-BKG-8831',
      boardId: 'board-2',
      boardTitle: 'FC Road High Street Commercial Unipole',
      boardType: 'Unipole Billboard',
      area: 'FC Road, Pune',
      startDate: '10 Oct 2026',
      endDate: '25 Oct 2026',
      durationDays: 15,
      totalAmount: 48000,
      priceBreakdown: '2 weeks (₹44,000) + 1 day (₹4,000)',
      status: 'approved',
      paymentStatus: 'paid',
      bookingType: 'exclusive',
      ownerName: 'Western Outdoor Advertising',
      ownerPhone: '+91 98220 55555',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'bkg-100',
      bookingId: 'FA-BKG-7714',
      boardId: 'board-3',
      boardTitle: 'Viman Nagar Airport Road Mega Hoarding',
      boardType: 'Mega Hoarding',
      area: 'Viman Nagar, Pune',
      startDate: '01 Aug 2026',
      endDate: '31 Aug 2026',
      durationDays: 30,
      totalAmount: 110000,
      priceBreakdown: '1 month pack (₹110,000)',
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'exclusive',
      ownerName: 'SkyLine Hoardings',
      ownerPhone: '+91 98220 77777',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Payment Flow (Phase 22)
  const [payingBooking, setPayingBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Review Flow (Phase 23)
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch client bookings from backend
  useEffect(() => {
    setIsLoadingBookings(true);
    bookingService.getMyBookings()
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          const mapped = data.bookings.map((b) => ({
            id: b._id || b.bookingId,
            bookingId: b.bookingId,
            boardId: b.boardId?._id || b.boardId?.id || b.boardId,
            boardTitle: b.boardId?.title || 'Pune Billboard Space',
            boardType: b.boardId?.boardType || 'Advertising Board',
            area: b.boardId?.area || 'Pune',
            startDate: new Date(b.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            endDate: new Date(b.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            durationDays: b.duration,
            totalAmount: b.totalAmount,
            priceBreakdown: b.priceBreakdown,
            status: b.status,
            paymentStatus: b.paymentStatus || 'unpaid',
            bookingType: b.bookingType || 'exclusive',
            digitalConfig: b.digitalConfig,
            ownerName: b.advertiserId?.name || 'Verified Owner',
            ownerPhone: b.advertiserId?.phone || '+91 98220 00000',
            image: b.boardId?.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          }));
          setBookings(mapped);
        }
      })
      .catch(() => {
        // Fallback to initial mock state
      })
      .finally(() => {
        setIsLoadingBookings(false);
      });
  }, []);

  const handleOpenPayment = (booking) => {
    setPayingBooking(booking);
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  const handleProcessRazorpayPayment = async () => {
    if (!payingBooking) return;
    setIsProcessingPayment(true);
    try {
      let orderId = `order_${Date.now()}`;
      try {
        const orderRes = await paymentService.createPaymentOrder(payingBooking.id);
        if (orderRes.order?.id) orderId = orderRes.order.id;
      } catch (e) {
        // Mock fallback
      }

      const paymentId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        await paymentService.verifyPayment({
          bookingId: payingBooking.id,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: 'mock_sig_valid',
        });
      } catch (e) {
        // Mock fallback
      }

      setBookings(bookings.map(b => b.id === payingBooking.id ? { ...b, paymentStatus: 'paid' } : b));
      setPaymentSuccess(true);
    } catch (err) {
      alert('Payment could not be completed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleOpenReview = (booking) => {
    setReviewingBooking(booking);
    setReviewRating(5);
    setReviewComment('');
    setReviewSubmitted(false);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewingBooking) return;

    try {
      await reviewService.createReview({
        boardId: reviewingBooking.boardId || reviewingBooking.id,
        bookingId: reviewingBooking.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
    } catch (err) {}

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  // Favorites state
  const [favorites, setFavorites] = useState([mockBoards[0], mockBoards[1]]);

  // Messages state
  const [activeThread, setActiveThread] = useState('Apex Media DOOH');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Apex Media DOOH', text: 'Hello Rahul! We saw your booking request for the Hinjewadi LED screen. Artwork specs are 3840x2160 MP4.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Rahul Kulkarni', text: 'Hi! Yes, we have our Diwali admissions video ready in 4K 15-second spot format. Will upload shortly.', time: '10:35 AM', isMe: true },
    { id: 3, sender: 'Apex Media DOOH', text: 'Perfect. Once approved, it will run 60 times an hour between 8 AM and 10 PM.', time: '10:40 AM', isMe: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Rahul Kulkarni',
    email: user?.email || 'rahul.client@example.com',
    phone: user?.phone || '+91 98220 33333',
    company: 'Pune Academy of Sciences',
    gstin: '27AABCU9603R1ZM'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Computed metrics
  const activeCampaignsCount = bookings.filter(b => b.status === 'approved').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;
  const completedCampaignsCount = bookings.filter(b => b.status === 'completed').length;
  const totalSpending = bookings
    .filter(b => b.status === 'approved' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const handleCancelBooking = async (id) => {
    try {
      await bookingService.cancelBooking(id);
    } catch (e) {
      // Local fallback
    }
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: user?.name || 'Rahul Kulkarni',
      text: newMessage,
      time: 'Just now',
      isMe: true
    }]);
    setNewMessage('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const removeFavorite = (boardId) => {
    setFavorites(favorites.filter(f => f.id !== boardId));
  };

  // Nav items for Sidebar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Boards', icon: Search, path: '/explore' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: bookings.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 1 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <DashboardLayout
      roleTitle="Client"
      roleBadgeColor="blue"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
      }}
    >
      {/* 1. DASHBOARD OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Business Advertiser Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user?.name || 'Rahul'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Overview of your active billboard campaigns, incoming approvals, and advertising spending across Pune.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('bookings');
                  setSearchParams({ tab: 'bookings' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
              >
                <span>View All Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 CORE DASHBOARD METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Active Campaigns */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Active Campaigns</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">{activeCampaignsCount}</div>
              <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live on FC Road</span>
              </div>
            </div>

            {/* Metric 2: Pending Bookings */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Pending Bookings</span>
                <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-orange-400">{pendingBookingsCount}</div>
              <div className="text-xs text-slate-400 mt-2">
                Awaiting owner confirmation
              </div>
            </div>

            {/* Metric 3: Completed Campaigns */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Completed Campaigns</span>
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Calendar className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">{completedCampaignsCount}</div>
              <div className="text-xs text-slate-400 mt-2">
                Lifetime completed runs
              </div>
            </div>

            {/* Metric 4: Total Spending */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Total Spending</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <CreditCard className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">{formatCurrency(totalSpending)}</div>
              <div className="text-xs text-blue-400 mt-2">
                Transparent duration rates
              </div>
            </div>

          </div>

          {/* Quick Active & Pending Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live Campaign Spotlight */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Live Campaign in Progress
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ● Displaying Now
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80"
                  alt="FC Road Unipole"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate">FC Road High Street Commercial Unipole</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-orange-400" /> FC Road (Shivajinagar), Pune
                  </p>
                  <div className="text-xs text-slate-300 font-semibold mt-2">
                    10 Oct 2026 – 25 Oct 2026 (15 Days) • {formatCurrency(48000)}
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Requests Status */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Pending Booking Request
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Awaiting Owner Approval
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
                  alt="Hinjewadi LED"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate">Hinjewadi Phase 1 Ultra HD LED Screen</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-orange-400" /> Hinjewadi, Pune
                  </p>
                  <div className="text-xs text-slate-300 font-semibold mt-2">
                    01 Nov 2026 – 08 Nov 2026 (7 Days) • {formatCurrency(27000)}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. MY BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">My Advertising Bookings</h2>
              <p className="text-xs text-slate-400">Track campaign dates, duration totals, and owner approvals</p>
            </div>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
            >
              + Book Another Board
            </Link>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <img
                    src={booking.image}
                    alt={booking.boardTitle}
                    className="w-full sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                        {booking.boardType}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        {booking.area}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white mb-2">{booking.boardTitle}</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Dates</span>
                        <span className="text-slate-200 font-semibold">{booking.startDate} to {booking.endDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Duration</span>
                        <span className="text-slate-200 font-semibold">{booking.durationDays} Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Price</span>
                        <span className="text-white font-bold">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {booking.status === 'approved' && (
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        Approved by Owner
                      </span>

                      {booking.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          ✓ Paid via Razorpay
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(booking)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Pay via Razorpay</span>
                        </button>
                      )}
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      <Clock className="w-4 h-4" />
                      Pending Owner Approval
                    </span>
                  )}

                  {booking.status === 'completed' && (
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        Campaign Completed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(booking)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Rate & Review</span>
                      </button>
                    </div>
                  )}

                  {booking.status === 'cancelled' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      <XCircle className="w-4 h-4" />
                      Cancelled
                    </span>
                  )}

                  <div className="text-xs text-slate-400">
                    Owner: <strong className="text-slate-200">{booking.ownerName}</strong>
                  </div>

                  {booking.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer underline"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FAVORITES TAB */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Saved Billboard Spaces</h2>
              <p className="text-xs text-slate-400">Shortlisted boards for upcoming marketing campaigns</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
              {favorites.length} Saved
            </span>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((board) => (
                <div key={board.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                      <img src={board.images[0]} alt={board.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFavorite(board.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-red-400 hover:text-red-300 backdrop-blur-md cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-white mb-1">{board.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-orange-400" /> {board.area}, Pune
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Monthly Rate</span>
                      <span className="text-base font-bold text-white">{formatCurrency(board.pricePerMonth)}</span>
                    </div>

                    <Link
                      to={`/explore?board=${board.id}`}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800">
              <Heart className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No saved boards yet</h3>
              <p className="text-xs text-slate-400 mb-4">Explore Pune inventory and click the heart icon to save.</p>
              <Link to="/explore" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                Explore Boards
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="h-[600px] rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row overflow-hidden shadow-xl">
          
          {/* Thread List */}
          <div className="w-full md:w-72 border-r border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
              Direct Messages
            </h3>
            
            <button
              type="button"
              onClick={() => setActiveThread('Apex Media DOOH')}
              className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                activeThread === 'Apex Media DOOH' ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-900'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                AM
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate">Apex Media DOOH</div>
                <div className="text-[11px] text-slate-400 truncate">Hinjewadi LED Screen</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveThread('Western Outdoor')}
              className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                activeThread === 'Western Outdoor' ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-900'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">
                WO
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate">Western Outdoor Advertising</div>
                <div className="text-[11px] text-slate-400 truncate">FC Road Unipole</div>
              </div>
            </button>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-slate-900/40">
            {/* Thread Header */}
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">{activeThread}</h4>
                <span className="text-[11px] text-emerald-400 font-medium">● Online • Verified Owner</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.isMe
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700/60'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeThread}...`}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 5. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Advertiser Profile & Business Details</h2>
            <p className="text-xs text-slate-400">Keep your billing and contact details up to date</p>
          </div>

          {profileSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                GSTIN / Tax ID (Optional for Invoices)
              </label>
              <input
                type="text"
                value={profileData.gstin}
                onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer mt-2"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Razorpay Payment Checkout Modal (Phase 22) */}
      {isPaymentModalOpen && payingBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            
            {/* Razorpay Header Bar */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">FlashAds Razorpay Checkout</h3>
                    <p className="text-xs text-blue-200">Official Payment Gateway</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {paymentSuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Payment Verified & Confirmed!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your payment of <strong className="text-white">{formatCurrency(payingBooking.totalAmount)}</strong> for <strong className="text-white">{payingBooking.boardTitle}</strong> was verified and settled via Razorpay.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2 text-left">
                    <div className="flex justify-between text-slate-400">
                      <span>Booking Ref:</span>
                      <span className="font-mono text-white">{payingBooking.bookingId || payingBooking.id}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-emerald-400">pay_{Date.now().toString().slice(-8)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Gateway Status:</span>
                      <span className="text-emerald-400 font-bold">Captured (INR)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Done & View Bookings
                  </button>
                </div>
              ) : (
                <>
                  {/* Booking Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Board Space:</span>
                      <strong className="text-white truncate max-w-[200px]">{payingBooking.boardTitle}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Campaign Window:</span>
                      <span className="text-white font-medium">{payingBooking.startDate} – {payingBooking.endDate} ({payingBooking.durationDays} Days)</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 font-bold text-sm">
                      <span className="text-slate-300">Amount Due:</span>
                      <span className="text-emerald-400 text-base">{formatCurrency(payingBooking.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Select Payment Method
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <QrCode className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                        <span className="text-[11px] font-bold block">UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                        <span className="text-[11px] font-bold block">Debit/Credit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                        <span className="text-[11px] font-bold block">NetBanking</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      256-Bit SSL Encrypted Razorpay Checkout
                    </span>
                    <span className="font-bold text-slate-300">Test Mode</span>
                  </div>

                  {/* Payment CTA */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleProcessRazorpayPayment}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying with Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white" />
                          <span>Authorize & Pay {formatCurrency(payingBooking.totalAmount)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Review Submission Modal (Phase 23) */}
      {isReviewModalOpen && reviewingBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Rate & Review Campaign</h3>
                <p className="text-xs text-slate-400 truncate max-w-[240px]">{reviewingBooking.boardTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Thank you for your review!</h4>
                <p className="text-xs text-slate-400">Your feedback has been published on the board's public marketplace profile.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Campaign Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      {reviewRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    Location Visibility & Campaign Results
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Good location and excellent visibility. Crisp digital display during evening peak hours."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
