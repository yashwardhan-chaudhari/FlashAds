import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all-boards' | 'stats'
  
  // Pending Boards Queue for Admin Review
  const [boards, setBoards] = useState([
    {
      id: 'pb-101',
      title: 'Wakad Bridge Flyover Double Sided Hoarding',
      description: 'Newly constructed high-elevation hoarding facing Wakad flyover and Mumbai-Pune expressway connector. High vehicle dwell time during evening peak hours.',
      boardType: 'hoarding',
      city: 'Pune',
      area: 'Wakad',
      address: 'Wakad Bridge Junction, Pune 411057',
      latitude: 18.5987,
      longitude: 73.7654,
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
      ownerName: 'Meena Deshmukh (Owner)',
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
      latitude: 18.5018,
      longitude: 73.8636,
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

  // Active rejection modal state
  const [rejectingBoardId, setRejectingBoardId] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  // Handlers
  const handleApprove = (id) => {
    setBoards(boards.map(b => b.id === id ? { ...b, status: 'approved', rejectionReason: '' } : b));
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionFeedback.trim() || !rejectingBoardId) return;

    setBoards(boards.map(b => b.id === rejectingBoardId ? { ...b, status: 'rejected', rejectionReason: rejectionFeedback.trim() } : b));
    setRejectingBoardId(null);
    setRejectionFeedback('');
  };

  const pendingBoardsList = boards.filter(b => b.status === 'pending');
  const approvedBoardsList = boards.filter(b => b.status === 'approved');

  const navItems = [
    { id: 'pending', label: 'Pending Moderation', icon: ShieldCheck, badge: pendingBoardsList.length },
    { id: 'all-boards', label: 'All Marketplace Boards', icon: Tv, badge: boards.length },
    { id: 'stats', label: 'Platform Metrics', icon: TrendingUp },
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
        
        {/* Top Console Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Quality Gatekeeper</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Board Moderation & Marketplace Oversight
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect new board submissions from owners before they go live on public Explore. Enforce verified photos, clear rates, and GPS accuracy.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending Queue ({pendingBoardsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all-boards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all-boards'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Boards ({boards.length})
            </button>
          </div>
        </div>

        {/* 1. PENDING MODERATION QUEUE (PHASE 9 FOCUS) */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Pending Approval Queue</h2>
                <p className="text-xs text-slate-400">Review specs, photos, location, and rates</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                {pendingBoardsList.length} Awaiting Verification
              </span>
            </div>

            {pendingBoardsList.length > 0 ? (
              <div className="space-y-6">
                {pendingBoardsList.map((board) => (
                  <div
                    key={board.id}
                    className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-6"
                  >
                    {/* Top Row: Title, Format, Owner */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                            {board.boardType}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{board.createdAt}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{board.title}</h3>
                      </div>

                      {/* Owner Details Card */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <User className="w-3.5 h-3.5 text-orange-400" />
                          <span>Owner: {board.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-400" /> {board.ownerEmail}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {board.ownerPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Grid: Photos & Location & Specs & Pricing */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Photos Preview (4 cols) */}
                      <div className="lg:col-span-4 space-y-2">
                        <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative group cursor-pointer"
                             onClick={() => setSelectedImagePreview(board.images[0])}>
                          <img
                            src={board.images[0]}
                            alt={board.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" /> Click to Enlarge
                          </div>
                        </div>

                        {board.images.length > 1 && (
                          <div className="grid grid-cols-3 gap-2">
                            {board.images.slice(1).map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`Sub ${i}`}
                                onClick={() => setSelectedImagePreview(img)}
                                className="aspect-[4/3] rounded-xl object-cover border border-slate-800 cursor-pointer hover:opacity-80"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Specs, Pricing, Location (8 cols) */}
                      <div className="lg:col-span-8 space-y-4">
                        
                        {/* Location Details */}
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                            <MapPin className="w-4 h-4" />
                            <span>Location & Coordinates</span>
                          </div>
                          <p className="text-sm font-semibold text-white">{board.address}, {board.area}, Pune</p>
                          <div className="text-xs text-slate-400 font-mono">
                            GPS Lat: {board.latitude} • Long: {board.longitude}
                          </div>
                        </div>

                        {/* Specs & Traffic */}
                        <div className="grid grid-cols-3 gap-3 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Dimensions</span>
                            <span className="font-bold text-white text-sm">{board.dimensions}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Traffic Level</span>
                            <span className="font-bold text-emerald-400 capitalize text-sm">{board.trafficLevel}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Visibility</span>
                            <span className="text-slate-300 truncate block">{board.visibility}</span>
                          </div>
                        </div>

                        {/* Duration Pricing Rate Cards */}
                        <div className="grid grid-cols-3 gap-3 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Daily Rate</span>
                            <span className="font-extrabold text-slate-200 text-base">{formatCurrency(board.pricePerDay)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Weekly Rate</span>
                            <span className="font-extrabold text-slate-200 text-base">{formatCurrency(board.pricePerWeek)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Monthly Rate</span>
                            <span className="font-extrabold text-orange-400 text-base">{formatCurrency(board.pricePerMonth)}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-900/50 p-3 rounded-xl">
                          "{board.description}"
                        </p>
                      </div>

                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        Approving will immediately list this space on public <Link to="/explore" className="text-blue-400 underline">Explore</Link>.
                      </span>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleApprove(board.id)}
                          className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Board</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRejectingBoardId(board.id)}
                          className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-red-400 hover:bg-red-500/10 active:scale-95 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Board</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Queue is Clear!</h3>
                <p className="text-xs text-slate-400">All submitted advertising spaces have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. ALL MARKETPLACE BOARDS TAB */}
        {activeTab === 'all-boards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Platform Inventory</h2>
                <p className="text-xs text-slate-400">Overview of all approved, pending, and rejected spaces</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boards.map((board) => (
                <div key={board.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                      <img src={board.images[0]} alt={board.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        {board.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                            ● Live & Approved
                          </span>
                        )}
                        {board.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                            ⏳ Pending Admin Review
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
                      <MapPin className="w-3 h-3 text-orange-400" /> {board.area}
                    </p>
                    <div className="text-xs text-slate-400 font-medium">
                      Owner: <strong className="text-slate-200">{board.ownerName}</strong> • {formatCurrency(board.pricePerMonth)}/mo
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400 font-mono">ID: {board.id}</span>
                    {board.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(board.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Approve Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Users</span>
                <div className="text-3xl font-extrabold text-white">340</div>
                <p className="text-xs text-slate-400 mt-2">40 Owners • 300 Clients</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Approved Public Boards</span>
                <div className="text-3xl font-extrabold text-emerald-400">{approvedBoardsList.length}</div>
                <p className="text-xs text-slate-400 mt-2">100% Verified Listings</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Platform Volume</span>
                <div className="text-3xl font-extrabold text-blue-400">{formatCurrency(1480000)}</div>
                <p className="text-xs text-slate-400 mt-2">Across 150+ Requests</p>
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
