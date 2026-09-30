import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../layouts/DashboardLayout';
import AddBoardForm from '../../components/boards/AddBoardForm';
import { 
  LayoutDashboard, 
  Tv, 
  PlusCircle, 
  Inbox, 
  MessageSquare, 
  DollarSign, 
  User, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Maximize2, 
  TrendingUp, 
  Upload, 
  Send, 
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { mockBoards } from '../../data/mockBoards';
import bookingService from '../../services/bookingService';

export default function AdvertiserDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Owned Boards State
  const [myBoards, setMyBoards] = useState([
    {
      id: 'b-101',
      title: 'Hinjewadi Phase 1 IT Park Ultra HD LED Screen',
      boardType: 'LED digital screen',
      area: 'Hinjewadi, Pune',
      dimensions: '30 × 15 ft',
      pricePerDay: 4500,
      pricePerWeek: 27000,
      pricePerMonth: 95000,
      status: 'approved', // 'approved' | 'pending' | 'unavailable'
      isAvailable: true,
      activeBookingsCount: 1,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b-102',
      title: 'FC Road High Street Commercial Unipole',
      boardType: 'unipole',
      area: 'FC Road (Shivajinagar), Pune',
      dimensions: '40 × 20 ft',
      pricePerDay: 3800,
      pricePerWeek: 22000,
      pricePerMonth: 80000,
      status: 'approved',
      isAvailable: true,
      activeBookingsCount: 1,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b-104',
      title: 'Baner-Balewadi High Street Corner Screen',
      boardType: 'LED digital screen',
      area: 'Baner, Pune',
      dimensions: '25 × 12 ft',
      pricePerDay: 3200,
      pricePerWeek: 19000,
      pricePerMonth: 68000,
      status: 'approved',
      isAvailable: true,
      activeBookingsCount: 0,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b-107',
      title: 'Wakad Bridge Flyover Double Sided Hoarding',
      boardType: 'hoarding',
      area: 'Wakad, Pune',
      dimensions: '50 × 25 ft',
      pricePerDay: 4000,
      pricePerWeek: 24000,
      pricePerMonth: 88000,
      status: 'pending', // Pending Admin Approval
      isAvailable: true,
      activeBookingsCount: 0,
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Booking Requests State (Phase 16)
  const [requests, setRequests] = useState([
    {
      id: 'req-201',
      clientName: 'Rahul Sharma',
      clientEmail: 'rahul.sharma@example.com',
      boardTitle: 'Pune LED Screen',
      boardId: 'b-101',
      startDate: '10 Oct 2026',
      endDate: '25 Oct 2026',
      durationDays: 15,
      totalAmount: 18000,
      priceBreakdown: '2 weeks + 1 day tier (₹18,000)',
      status: 'pending',
      requestedAt: '10 mins ago'
    },
    {
      id: 'req-202',
      clientName: 'Amit Shinde (QuickDine Pune)',
      clientEmail: 'amit.shinde@quickdine.com',
      boardTitle: 'Baner-Balewadi High Street Corner Screen',
      boardId: 'b-104',
      startDate: '15 Nov 2026',
      endDate: '22 Nov 2026',
      durationDays: 7,
      totalAmount: 19000,
      priceBreakdown: '1 week tier (₹19,000)',
      status: 'pending',
      requestedAt: '3 hours ago'
    },
    {
      id: 'req-200',
      clientName: 'Rahul Kulkarni (Pune Academy)',
      clientEmail: 'rahul.client@example.com',
      boardTitle: 'FC Road High Street Commercial Unipole',
      boardId: 'b-102',
      startDate: '10 Oct 2026',
      endDate: '25 Oct 2026',
      durationDays: 15,
      totalAmount: 48000,
      priceBreakdown: '2 weeks + 1 day tier (₹48,000)',
      status: 'approved',
      requestedAt: '2 days ago'
    }
  ]);

  // Fetch advertiser requests from backend
  useEffect(() => {
    setIsLoadingRequests(true);
    bookingService.getAdvertiserRequests()
      .then((data) => {
        if (data.requests && data.requests.length > 0) {
          const mapped = data.requests.map((r) => ({
            id: r._id || r.bookingId,
            bookingId: r.bookingId,
            clientName: r.clientId?.name || 'Rahul Sharma',
            clientEmail: r.clientId?.email || 'client@example.com',
            boardTitle: r.boardId?.title || 'Pune Advertising Board',
            boardId: r.boardId?._id || r.boardId?.id,
            startDate: new Date(r.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            endDate: new Date(r.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            durationDays: r.duration,
            totalAmount: r.totalAmount,
            priceBreakdown: r.priceBreakdown,
            status: r.status,
            requestedAt: 'Recently',
          }));
          setRequests(mapped);
        }
      })
      .catch(() => {
        // Fallback to initial mock state
      })
      .finally(() => {
        setIsLoadingRequests(false);
      });
  }, []);

  // Messages State
  const [activeClient, setActiveClient] = useState('Rahul Sharma');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Rahul Sharma', text: 'Hi Meena! Inquiring if your Hinjewadi LED supports 10-second MP4 spot slots?', time: '09:15 AM', isMe: false },
    { id: 2, sender: 'Meena Deshmukh', text: 'Hello Rahul! Yes, 10s and 15s spots are supported. We run full motion digital display with audio-off.', time: '09:20 AM', isMe: true },
    { id: 3, sender: 'Rahul Sharma', text: 'Great, just submitted the booking request for October 10th to 25th!', time: '09:30 AM', isMe: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Metrics calculation
  const totalBoards = myBoards.length;
  const activeBoards = myBoards.filter(b => b.status === 'approved').length;
  const pendingBoards = myBoards.filter(b => b.status === 'pending').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const totalEarnings = requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.totalAmount, 0) || 245000;

  // Handlers (Phase 16)
  const handleApproveRequest = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'approved');
    } catch (e) {
      // Local UI update
    }
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleRejectRequest = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'rejected');
    } catch (e) {
      // Local UI update
    }
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const toggleBoardAvailability = (id) => {
    setMyBoards(myBoards.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'unavailable' ? 'approved' : 'unavailable';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleNewBoardCreated = (createdBoard) => {
    setMyBoards([createdBoard, ...myBoards]);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: user?.name || 'Meena Deshmukh',
      text: chatInput,
      time: 'Just now',
      isMe: true
    }]);
    setChatInput('');
  };

  // Nav items for Sidebar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'boards', label: 'My Boards', icon: Tv, badge: totalBoards },
    { id: 'add-board', label: 'Add Board', icon: PlusCircle },
    { id: 'requests', label: 'Booking Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 1 },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      roleTitle="Board Owner"
      roleBadgeColor="orange"
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
          
          {/* Welcome Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-2">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Board Owner & Operator Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, {user?.name || 'Meena'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Overview of your listed outdoor billboards, real-time booking requests, and revenue across Pune.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('add-board');
                  setSearchParams({ tab: 'add-board' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List New Board</span>
              </button>
            </div>
          </div>

          {/* 5 CORE DASHBOARD METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Total Boards */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Total Boards
              </div>
              <div className="text-3xl font-extrabold text-white">{totalBoards}</div>
              <div className="text-xs text-slate-400 mt-2">
                All listed inventory
              </div>
            </div>

            {/* 2. Active Boards */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Active Boards
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">{activeBoards}</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Published & Public</span>
              </div>
            </div>

            {/* 3. Pending Boards */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Pending Boards
              </div>
              <div className="text-3xl font-extrabold text-amber-400">{pendingBoards}</div>
              <div className="text-xs text-slate-400 mt-2">
                Under admin review
              </div>
            </div>

            {/* 4. Booking Requests */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Booking Requests
              </div>
              <div className="text-3xl font-extrabold text-orange-400">{pendingRequestsCount}</div>
              <div className="text-xs text-orange-400 mt-2">
                Requires your action
              </div>
            </div>

            {/* 5. Earnings */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Earnings
              </div>
              <div className="text-2xl font-extrabold text-white">{formatCurrency(totalEarnings)}</div>
              <div className="text-xs text-blue-400 mt-2">
                Zero broker cuts
              </div>
            </div>

          </div>

          {/* Quick Booking Requests Table on Dashboard */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Action Required: New Requests</h3>
                <p className="text-xs text-slate-400">Review date reservations from businesses</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('requests');
                  setSearchParams({ tab: 'requests' });
                }}
                className="text-xs font-bold text-orange-400 hover:underline cursor-pointer"
              >
                View All Requests →
              </button>
            </div>

            <div className="space-y-3">
              {requests.filter(r => r.status === 'pending').map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-sm text-white mb-0.5">{req.clientName}</div>
                    <div className="text-xs text-slate-400">{req.boardTitle}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold mt-2">
                      <span>{req.startDate} to {req.endDate} ({req.durationDays} days)</span>
                      <span>•</span>
                      <span className="text-orange-400 font-bold">{formatCurrency(req.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveRequest(req.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(req.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. MY BOARDS TAB */}
      {activeTab === 'boards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">My Advertising Spaces</h2>
              <p className="text-xs text-slate-400">Manage your hoardings, LED screens, and availability</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('add-board');
                setSearchParams({ tab: 'add-board' });
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Board</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBoards.map((board) => (
              <div key={board.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                    <img src={board.image || board.images?.[0]} alt={board.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      {board.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md">
                          ● Approved & Public
                        </span>
                      )}
                      {board.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md">
                          ⏳ Pending Admin Review
                        </span>
                      )}
                      {board.status === 'unavailable' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/90 text-white backdrop-blur-md">
                          ✕ Hidden / Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">{board.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-orange-400" /> {board.area}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                    <Maximize2 className="w-3 h-3 text-blue-400" /> {board.dimensions}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center mb-4">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Daily</span>
                      <span className="font-bold text-slate-200">{formatCurrency(board.pricePerDay)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Weekly</span>
                      <span className="font-bold text-slate-200">{formatCurrency(board.pricePerWeek)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Monthly</span>
                      <span className="font-bold text-white">{formatCurrency(board.pricePerMonth)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleBoardAvailability(board.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${
                      board.status === 'unavailable'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : 'border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {board.status === 'unavailable' ? 'Mark Available' : 'Hide from Explore'}
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Active campaigns: <strong className="text-white">{board.activeBookingsCount}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ADD BOARD TAB (PHASE 7 INTEGRATION) */}
      {activeTab === 'add-board' && (
        <AddBoardForm onBoardAdded={handleNewBoardCreated} />
      )}

      {/* 4. BOOKING REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Booking Requests</h2>
              <p className="text-xs text-slate-400">Review, approve, or reject incoming reservations</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
              {requests.length} Total Requests
            </span>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base text-white">{req.clientName}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{req.clientEmail}</span>
                  </div>

                  <h3 className="font-semibold text-sm text-orange-400 mb-3">{req.boardTitle}</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Requested Dates</span>
                      <span className="text-slate-200 font-semibold">{req.startDate} to {req.endDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Duration</span>
                      <span className="text-slate-200 font-semibold">{req.durationDays} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Calculated Total</span>
                      <span className="text-white font-bold">{formatCurrency(req.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Booking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Approved & Calendar Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">
                      <XCircle className="w-4 h-4" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="h-[600px] rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row overflow-hidden shadow-xl">
          <div className="w-full md:w-72 border-r border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
              Client Conversations
            </h3>
            <button
              type="button"
              className="w-full p-3 rounded-2xl text-left bg-orange-600/20 border border-orange-500/30 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                RK
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate">Rahul Kulkarni</div>
                <div className="text-[11px] text-slate-400 truncate">Pune Academy of Sciences</div>
              </div>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-slate-900/40">
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">Rahul Kulkarni</h4>
                <span className="text-[11px] text-slate-400">Re: Hinjewadi LED Screen Reservation</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.isMe ? 'bg-orange-500 text-white rounded-tr-xs' : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700/60'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Reply to advertiser..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. EARNINGS TAB */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Earnings & Revenue Breakdown</h2>
              <p className="text-xs text-slate-400">Direct booking revenues across all your Pune inventory</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Revenue
              </span>
              <div className="text-3xl font-extrabold text-white">{formatCurrency(245000)}</div>
              <p className="text-xs text-emerald-400 mt-2">100% Retained (0% Commission)</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Bookings Value
              </span>
              <div className="text-3xl font-extrabold text-orange-400">{formatCurrency(75000)}</div>
              <p className="text-xs text-slate-400 mt-2">2 campaigns currently running</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Average Occupancy Rate
              </span>
              <div className="text-3xl font-extrabold text-blue-400">82%</div>
              <p className="text-xs text-slate-400 mt-2">Across 4 listed boards</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-1">Board Owner Profile</h2>
          <p className="text-xs text-slate-400 mb-6">Manage your business information and payout contact</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input type="text" defaultValue={user?.name || 'Meena Deshmukh'} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
                <input type="email" disabled defaultValue={user?.email || 'meena.owner@example.com'} className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone</label>
                <input type="tel" defaultValue={user?.phone || '+91 98220 22222'} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" />
              </div>
            </div>
            <button type="button" className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold cursor-pointer">
              Update Profile
            </button>
          </div>
        </div>
      )}

      {/* 8. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-1">Account & Marketplace Settings</h2>
          <p className="text-xs text-slate-400 mb-6">Configure notification preferences and calendar automation</p>
          
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Auto-Expire Unanswered Requests</div>
                <div className="text-slate-400 text-[11px]">Automatically cancel pending requests after 48 hours</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4 cursor-pointer" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Email & SMS Instant Notifications</div>
                <div className="text-slate-400 text-[11px]">Get alerted when a client sends a booking request</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
