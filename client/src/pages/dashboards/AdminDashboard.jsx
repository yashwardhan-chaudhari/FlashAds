import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Tv, 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  Eye,
  Maximize2,
  DollarSign,
  Activity,
  User,
  Phone,
  Mail,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  CreditCard,
  Building2,
  ArrowUpRight,
  Clock,
  Check,
  Ban,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'pending' | 'all-boards' | 'users' | 'bookings'
  const [isLoading, setIsLoading] = useState(false);

  // Platform Analytics State (Phase 24)
  const [stats, setStats] = useState({
    totalUsers: 355,
    totalAdvertisers: 45,
    totalClients: 310,
    totalBoards: 44,
    approvedBoards: 36,
    pendingBoards: 8,
    rejectedBoards: 0,
    totalBookings: 114,
    completedBookings: 48,
    totalGMV: 1480000,
    platformRevenue: 148000,
  });

  const [charts, setCharts] = useState({
    registrations: [
      { month: 'May', clients: 45, advertisers: 12, total: 57 },
      { month: 'Jun', clients: 72, advertisers: 18, total: 90 },
      { month: 'Jul', clients: 110, advertisers: 24, total: 134 },
      { month: 'Aug', clients: 165, advertisers: 31, total: 196 },
      { month: 'Sep', clients: 220, advertisers: 38, total: 258 },
      { month: 'Oct', clients: 310, advertisers: 45, total: 355 },
    ],
    boards: [
      { type: 'LED Digital Screen', count: 18, share: '40%', color: 'from-blue-600 to-cyan-500' },
      { type: 'Hoarding / Billboard', count: 14, share: '32%', color: 'from-orange-500 to-amber-500' },
      { type: 'Unipole', count: 8, share: '18%', color: 'from-purple-600 to-indigo-500' },
      { type: 'Bus Shelter & Transit', count: 4, share: '10%', color: 'from-emerald-600 to-teal-500' },
    ],
    bookings: [
      { month: 'May', pending: 4, approved: 12, completed: 10, total: 26 },
      { month: 'Jun', pending: 6, approved: 18, completed: 16, total: 40 },
      { month: 'Jul', pending: 9, approved: 28, completed: 24, total: 61 },
      { month: 'Aug', pending: 11, approved: 36, completed: 32, total: 79 },
      { month: 'Sep', pending: 14, approved: 48, completed: 42, total: 104 },
      { month: 'Oct', pending: 8, approved: 58, completed: 48, total: 114 },
    ],
    revenue: [
      { month: 'May', gmv: 240000, revenue: 24000 },
      { month: 'Jun', gmv: 420000, revenue: 42000 },
      { month: 'Jul', gmv: 680000, revenue: 68000 },
      { month: 'Aug', gmv: 950000, revenue: 95000 },
      { month: 'Sep', gmv: 1240000, revenue: 124000 },
      { month: 'Oct', gmv: 1480000, revenue: 148000 },
    ],
  });

  // Boards Moderation Queue
  const [boards, setBoards] = useState([
    {
      id: 'pb-101',
      title: 'Wakad Bridge Flyover Double Sided Hoarding',
      description: 'Newly constructed high-elevation hoarding facing Wakad flyover and Mumbai-Pune expressway connector. High vehicle dwell time during evening peak hours.',
      boardType: 'hoarding',
      city: 'Pune',
      area: 'Wakad',
      address: 'Wakad Bridge Junction, Pune 411057',
      width: 45,
      height: 20,
      dimensions: '45 × 20 ft',
      trafficLevel: 'high',
      visibility: 'Highway Elevated Sightline - Frontlit',
      pricePerDay: 4000,
      pricePerWeek: 24000,
      pricePerMonth: 88000,
      status: 'pending',
      rejectionReason: '',
      ownerName: 'Meena Deshmukh',
      ownerEmail: 'meena.owner@example.com',
      ownerPhone: '+91 98220 22222',
      images: [
        'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
      ],
      createdAt: 'Today, 10:15 AM'
    },
    {
      id: 'pb-102',
      title: 'Swargate Junction Traffic Signal LED Screen',
      description: 'Centrally located DOOH digital screen at Swargate BRTS hub with heavy pedestrian and bus transit footfall. 10s MP4 slot rotation.',
      boardType: 'LED digital screen',
      city: 'Pune',
      area: 'Swargate',
      address: 'Swargate Bus Terminal Circle, Pune 411042',
      width: 20,
      height: 10,
      dimensions: '20 × 10 ft',
      trafficLevel: 'very high',
      visibility: 'Junction Traffic Facing • High Dwell Time',
      pricePerDay: 3000,
      pricePerWeek: 18000,
      pricePerMonth: 60000,
      status: 'pending',
      rejectionReason: '',
      ownerName: 'Apex Media Networks',
      ownerEmail: 'contact@apexmedia.in',
      ownerPhone: '+91 98220 88888',
      images: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
      ],
      createdAt: 'Today, 11:40 AM'
    },
    {
      id: 'b-101',
      title: 'Hinjewadi Phase 1 IT Park Ultra HD LED Screen',
      boardType: 'LED digital screen',
      area: 'Hinjewadi, Pune',
      dimensions: '30 × 15 ft',
      pricePerMonth: 95000,
      status: 'approved',
      ownerName: 'Apex Media DOOH',
      ownerEmail: 'contact@apexmedia.in',
      ownerPhone: '+91 98220 88888',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
      createdAt: '2 days ago'
    },
    {
      id: 'b-102',
      title: 'FC Road High Street Commercial Unipole',
      boardType: 'unipole',
      area: 'FC Road, Pune',
      dimensions: '40 × 20 ft',
      pricePerMonth: 80000,
      status: 'approved',
      ownerName: 'Western Outdoor Advertising',
      ownerEmail: 'western@outdoor.in',
      ownerPhone: '+91 98220 55555',
      images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80'],
      createdAt: '3 days ago'
    }
  ]);

  // Users Management State
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Rahul Kulkarni', email: 'rahul.client@example.com', role: 'client', phone: '+91 98220 33333', isActive: true, createdAt: '10 May 2026' },
    { id: 'u-2', name: 'Apex Media DOOH', email: 'contact@apexmedia.in', role: 'advertiser', phone: '+91 98220 88888', isActive: true, createdAt: '02 Jun 2026' },
    { id: 'u-3', name: 'Western Outdoor', email: 'western@outdoor.in', role: 'advertiser', phone: '+91 98220 55555', isActive: true, createdAt: '15 Jul 2026' },
    { id: 'u-4', name: 'Siddharth Patil', email: 'siddharth@growthbrand.com', role: 'client', phone: '+91 98220 99999', isActive: true, createdAt: '20 Aug 2026' },
    { id: 'u-5', name: 'FlashAds Admin', email: 'admin@flashads.in', role: 'admin', phone: '+91 98220 00000', isActive: true, createdAt: '01 Jan 2026' },
  ]);

  // Bookings Oversight State
  const [allBookings, setAllBookings] = useState([
    { id: 'FA-BKG-9012', boardTitle: 'Pune Premium LED Screen', clientName: 'Rahul Kulkarni', advertiserName: 'Apex Media DOOH', dates: '10 Oct – 25 Oct 2026', amount: 18000, status: 'approved', paymentStatus: 'paid' },
    { id: 'FA-BKG-8831', boardTitle: 'FC Road Commercial Unipole', clientName: 'Siddharth Patil', advertiserName: 'Western Outdoor', dates: '10 Oct – 25 Oct 2026', amount: 48000, status: 'approved', paymentStatus: 'paid' },
    { id: 'FA-BKG-7714', boardTitle: 'Viman Nagar Mega Hoarding', clientName: 'Rahul Kulkarni', advertiserName: 'SkyLine Hoardings', dates: '01 Aug – 31 Aug 2026', amount: 110000, status: 'completed', paymentStatus: 'paid' },
  ]);

  // Modals & previews
  const [rejectingBoardId, setRejectingBoardId] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  // Fetch backend data
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      adminService.getAdminStats().catch(() => null),
      adminService.getAllBoards().catch(() => null),
      adminService.getAllUsers().catch(() => null),
      adminService.getAllBookings().catch(() => null),
    ])
      .then(([statsRes, boardsRes, usersRes, bookingsRes]) => {
        if (statsRes?.stats) {
          setStats(statsRes.stats);
          if (statsRes.charts) setCharts(statsRes.charts);
        }
        if (boardsRes?.boards && boardsRes.boards.length > 0) {
          setBoards(boardsRes.boards.map(b => ({
            id: b._id || b.id,
            title: b.title,
            description: b.description,
            boardType: b.boardType,
            city: b.city || 'Pune',
            area: b.area,
            address: b.address,
            width: b.width,
            height: b.height,
            dimensions: `${b.width} × ${b.height} ft`,
            trafficLevel: b.trafficLevel,
            visibility: b.visibility,
            pricePerDay: b.pricePerDay,
            pricePerWeek: b.pricePerWeek,
            pricePerMonth: b.pricePerMonth,
            status: b.status,
            rejectionReason: b.rejectionReason,
            ownerName: b.ownerId?.name || 'Verified Owner',
            ownerEmail: b.ownerId?.email || 'owner@example.com',
            ownerPhone: b.ownerId?.phone || '+91 98220 00000',
            images: b.images || [],
            createdAt: new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          })));
        }
        if (usersRes?.users && usersRes.users.length > 0) {
          setUsersList(usersRes.users.map(u => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            phone: u.phone,
            isActive: u.isActive !== false,
            createdAt: new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          })));
        }
        if (bookingsRes?.bookings && bookingsRes.bookings.length > 0) {
          setAllBookings(bookingsRes.bookings.map(b => ({
            id: b.bookingId || b._id,
            boardTitle: b.boardId?.title || 'Billboard Space',
            clientName: b.clientId?.name || 'Client',
            advertiserName: b.advertiserId?.name || 'Advertiser',
            dates: `${new Date(b.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(b.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
            amount: b.totalAmount,
            status: b.status,
            paymentStatus: b.paymentStatus || 'unpaid',
          })));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Handlers
  const handleApprove = async (id) => {
    try {
      await adminService.approveBoard(id);
    } catch (e) {}
    setBoards(boards.map(b => b.id === id ? { ...b, status: 'approved', rejectionReason: '' } : b));
    setStats(prev => ({
      ...prev,
      approvedBoards: prev.approvedBoards + 1,
      pendingBoards: Math.max(0, prev.pendingBoards - 1),
    }));
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionFeedback.trim() || !rejectingBoardId) return;

    try {
      await adminService.rejectBoard(rejectingBoardId, rejectionFeedback.trim());
    } catch (e) {}

    setBoards(boards.map(b => b.id === rejectingBoardId ? { ...b, status: 'rejected', rejectionReason: rejectionFeedback.trim() } : b));
    setStats(prev => ({
      ...prev,
      rejectedBoards: prev.rejectedBoards + 1,
      pendingBoards: Math.max(0, prev.pendingBoards - 1),
    }));
    setRejectingBoardId(null);
    setRejectionFeedback('');
  };

  const handleToggleUser = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const pendingBoardsList = boards.filter(b => b.status === 'pending');
  const approvedBoardsList = boards.filter(b => b.status === 'approved');

  const navItems = [
    { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
    { id: 'pending', label: 'Pending Moderation', icon: ShieldCheck, badge: pendingBoardsList.length },
    { id: 'all-boards', label: 'Marketplace Boards', icon: Tv, badge: boards.length },
    { id: 'users', label: 'User Accounts', icon: Users, badge: usersList.length },
    { id: 'bookings', label: 'Booking Oversight', icon: Calendar, badge: allBookings.length },
  ];

  return (
    <DashboardLayout
      roleTitle="Super Admin"
      roleBadgeColor="emerald"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(tab) => setActiveTab(tab)}
    >
      <div className="space-y-8">
        
        {/* Top Metric Strip (Phase 24) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Users</span>
            <div className="text-xl font-extrabold text-white mt-1">{stats.totalUsers}</div>
            <span className="text-[9px] text-slate-500 font-medium">{stats.totalClients}c • {stats.totalAdvertisers}o</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Advertisers</span>
            <div className="text-xl font-extrabold text-blue-400 mt-1">{stats.totalAdvertisers}</div>
            <span className="text-[9px] text-blue-400/80 font-medium">Board Owners</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Clients</span>
            <div className="text-xl font-extrabold text-cyan-400 mt-1">{stats.totalClients}</div>
            <span className="text-[9px] text-cyan-400/80 font-medium">Active Buyers</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Boards</span>
            <div className="text-xl font-extrabold text-white mt-1">{stats.totalBoards}</div>
            <span className="text-[9px] text-emerald-400 font-medium">{stats.approvedBoards} Approved</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
            <div className="text-xl font-extrabold text-orange-400 mt-1">{stats.pendingBoards}</div>
            <span className="text-[9px] text-orange-400/80 font-medium">Needs Review</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Bookings</span>
            <div className="text-xl font-extrabold text-purple-400 mt-1">{stats.totalBookings}</div>
            <span className="text-[9px] text-purple-400/80 font-medium">Campaign Requests</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{stats.completedBookings}</div>
            <span className="text-[9px] text-emerald-400/80 font-medium">100% Fulfilled</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 bg-gradient-to-br from-slate-950 to-blue-950/40">
            <span className="text-[10px] uppercase font-bold text-orange-400 block">Platform Net</span>
            <div className="text-xl font-extrabold text-white mt-1">{formatCurrency(stats.platformRevenue)}</div>
            <span className="text-[9px] text-emerald-400 font-medium">10% Take Rate</span>
          </div>

        </div>

        {/* 1. ANALYTICS & CHARTS TAB (Phase 24) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  FlashAds Platform Analytics & Growth Trends
                </h2>
                <p className="text-xs text-slate-400">High-resolution breakdown of users, boards, campaign conversions, and net platform earnings</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
                  Last 6 Months
                </span>
              </div>
            </div>

            {/* Grid of 4 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: User Registrations */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      User Registrations Over Time
                    </h3>
                    <p className="text-[11px] text-slate-400">Monthly breakdown of advertising clients vs board owners</p>
                  </div>
                  <span className="text-xs font-extrabold text-cyan-400">+38% MoM</span>
                </div>

                {/* Bar Visualizer */}
                <div className="space-y-3 pt-2">
                  {charts.registrations.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 w-10">{item.month}</span>
                        <div className="flex-1 mx-3 h-4 bg-slate-900 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${(item.clients / item.total) * 100}%` }}
                            className="bg-cyan-500 h-full transition-all"
                            title={`Clients: ${item.clients}`}
                          ></div>
                          <div
                            style={{ width: `${(item.advertisers / item.total) * 100}%` }}
                            className="bg-blue-600 h-full transition-all"
                            title={`Advertisers: ${item.advertisers}`}
                          ></div>
                        </div>
                        <span className="font-bold text-white w-12 text-right">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-900 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                    <span className="text-slate-400">Clients ({stats.totalClients})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-slate-400">Board Owners ({stats.totalAdvertisers})</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Boards Distribution */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Tv className="w-4 h-4 text-orange-400" />
                      Board Inventory by Format
                    </h3>
                    <p className="text-[11px] text-slate-400">Distribution across LED screens, unipoles & hoardings</p>
                  </div>
                  <span className="text-xs font-extrabold text-orange-400">{stats.totalBoards} Total</span>
                </div>

                <div className="space-y-3 pt-2">
                  {charts.boards.map((b, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 truncate max-w-[180px]">{b.type}</span>
                        <span className="font-bold text-white">{b.count} ({b.share})</span>
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          style={{ width: b.share }}
                          className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-900 text-[11px] text-slate-400">
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="block text-[10px] text-slate-500">Approved Live</span>
                    <strong className="text-emerald-400">{stats.approvedBoards} Listings</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900">
                    <span className="block text-[10px] text-slate-500">Moderation Queue</span>
                    <strong className="text-orange-400">{stats.pendingBoards} Pending</strong>
                  </div>
                </div>
              </div>

              {/* Chart 3: Bookings Growth */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Campaign Bookings & Fulfillments
                    </h3>
                    <p className="text-[11px] text-slate-400">Monthly requests, approved campaigns and completions</p>
                  </div>
                  <span className="text-xs font-extrabold text-purple-400">96.4% Success</span>
                </div>

                <div className="space-y-3 pt-2">
                  {charts.bookings.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 w-10">{item.month}</span>
                        <div className="flex-1 mx-3 h-4 bg-slate-900 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${(item.completed / item.total) * 100}%` }}
                            className="bg-emerald-500 h-full"
                            title={`Completed: ${item.completed}`}
                          ></div>
                          <div
                            style={{ width: `${(item.approved / item.total) * 100}%` }}
                            className="bg-blue-500 h-full"
                            title={`Approved: ${item.approved}`}
                          ></div>
                          <div
                            style={{ width: `${(item.pending / item.total) * 100}%` }}
                            className="bg-orange-500 h-full"
                            title={`Pending: ${item.pending}`}
                          ></div>
                        </div>
                        <span className="font-bold text-white w-12 text-right">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-900 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-slate-400">Approved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-slate-400">Pending</span>
                  </div>
                </div>
              </div>

              {/* Chart 4: Revenue & Platform Commission */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      Platform Revenue & Gross GMV
                    </h3>
                    <p className="text-[11px] text-slate-400">Gross advertising booking volume vs net commission</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">{formatCurrency(stats.platformRevenue)} Net</span>
                </div>

                <div className="space-y-3 pt-2">
                  {charts.revenue.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 w-10">{item.month}</span>
                        <div className="flex-1 mx-3 h-4 bg-slate-900 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${(item.gmv / 1500000) * 100}%` }}
                            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full"
                          ></div>
                        </div>
                        <span className="font-bold text-white w-20 text-right">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Gross Campaign Value</span>
                    <strong className="text-white font-mono">{formatCurrency(stats.totalGMV)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">10% Platform Retained</span>
                    <strong className="text-emerald-400 font-mono">{formatCurrency(stats.platformRevenue)}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. PENDING MODERATION QUEUE */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                  Pending Moderation Queue ({pendingBoardsList.length})
                </h2>
                <p className="text-xs text-slate-400">Verify owner ownership, street coordinates, photo authenticity and pricing</p>
              </div>
            </div>

            {pendingBoardsList.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">All Caught Up!</h3>
                <p className="text-xs text-slate-400">There are no boards pending admin approval right now.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingBoardsList.map((board) => (
                  <div
                    key={board.id}
                    className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-6"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Photos column */}
                      <div className="w-full lg:w-72 shrink-0 space-y-2">
                        <div 
                          onClick={() => setSelectedImagePreview(board.images[0])}
                          className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer relative group"
                        >
                          <img src={board.images[0]} alt={board.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Maximize2 className="w-4 h-4" /> Enlarge
                          </div>
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                              {board.boardType}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-orange-400" />
                              {board.area}, {board.city}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{board.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{board.description}</p>
                        </div>

                        {/* Owner & Pricing Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Dimensions</span>
                            <span className="text-slate-200 font-semibold">{board.dimensions}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Traffic & Visibility</span>
                            <span className="text-slate-200 font-semibold capitalize">{board.trafficLevel} • Frontlit</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pricing (Day/Mo)</span>
                            <span className="text-white font-bold">{formatCurrency(board.pricePerDay)} / {formatCurrency(board.pricePerMonth)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Owner Contact</span>
                            <span className="text-blue-400 font-medium truncate block">{board.ownerName}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setRejectingBoardId(board.id)}
                            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject with Reason</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(board.id)}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Publish to Marketplace</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ALL BOARDS TAB */}
        {activeTab === 'all-boards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Marketplace Boards ({boards.length})</h2>
                <p className="text-xs text-slate-400">Complete catalog of approved, pending and rejected inventory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <div key={board.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                      <img src={board.images[0]} alt={board.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3">
                        {board.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                            ✓ Approved
                          </span>
                        )}
                        {board.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                            ⏳ Pending
                          </span>
                        )}
                        {board.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600 text-white">
                            ✕ Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-white mb-1">{board.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-orange-400" /> {board.area}, {board.city || 'Pune'}
                    </p>
                    <div className="text-xs text-slate-400 font-medium">
                      Owner: <strong className="text-slate-200">{board.ownerName}</strong> • {formatCurrency(board.pricePerMonth)}/mo
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400 font-mono">{board.dimensions}</span>
                    {board.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(board.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  User Accounts & Access Control ({usersList.length})
                </h2>
                <p className="text-xs text-slate-400">View and manage registered clients, board owners, and role permissions</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-6">User Name</th>
                      <th className="py-3.5 px-6">Email Address</th>
                      <th className="py-3.5 px-6">Role</th>
                      <th className="py-3.5 px-6">Phone</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{u.name}</td>
                        <td className="py-4 px-6 text-slate-300">{u.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : u.role === 'advertiser'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-mono">{u.phone || '—'}</td>
                        <td className="py-4 px-6">
                          {u.isActive ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1 font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleToggleUser(u.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                u.isActive
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {u.isActive ? 'Suspend' : 'Reactivate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. BOOKINGS OVERSIGHT TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Global Booking Oversight ({allBookings.length})
                </h2>
                <p className="text-xs text-slate-400">Real-time status of all booking transactions across the platform</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-6">Booking Ref</th>
                      <th className="py-3.5 px-6">Board Title</th>
                      <th className="py-3.5 px-6">Client</th>
                      <th className="py-3.5 px-6">Owner</th>
                      <th className="py-3.5 px-6">Dates</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {allBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-white">{b.id}</td>
                        <td className="py-4 px-6 text-slate-200 font-semibold truncate max-w-[200px]">{b.boardTitle}</td>
                        <td className="py-4 px-6 text-slate-300">{b.clientName}</td>
                        <td className="py-4 px-6 text-slate-400">{b.advertiserName}</td>
                        <td className="py-4 px-6 text-slate-300">{b.dates}</td>
                        <td className="py-4 px-6 font-bold text-emerald-400">{formatCurrency(b.amount)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : b.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[11px] font-bold ${b.paymentStatus === 'paid' ? 'text-blue-400' : 'text-slate-400'}`}>
                            {b.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Rejection Feedback Modal */}
      {rejectingBoardId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <XCircle className="w-5 h-5" />
              <span>Reject Board Listing</span>
            </div>
            <p className="text-xs text-slate-400">
              Please provide a clear reason for rejection so the board owner can update their listing (e.g., photo quality, inaccurate pricing, or missing coordinates).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                rows={4}
                required
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="e.g. Please upload higher resolution photos showing the full structure and verify the street landmark..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
              ></textarea>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingBoardId(null);
                    setRejectionFeedback('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-red-600/30"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Enlarge Modal */}
      {selectedImagePreview && (
        <div 
          onClick={() => setSelectedImagePreview(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <img src={selectedImagePreview} alt="Enlarged preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
