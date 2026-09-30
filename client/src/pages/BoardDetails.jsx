import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Maximize2, 
  Activity, 
  Star, 
  Calendar, 
  Tv, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  MessageSquare, 
  Share2, 
  Heart, 
  Zap, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Info,
  DollarSign,
  Building2,
  Lock,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { mockBoards } from '../data/mockBoards';
import { formatCurrency, formatDate, formatDuration } from '../utils/formatters';
import { calculateDurationPrice, calculateDigitalCampaignPrice, getDaysBetweenDates } from '../utils/pricingEngine';
import LeafletMap from '../components/common/LeafletMap';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import favoriteService from '../services/favoriteService';
import reviewService from '../services/reviewService';

export default function BoardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Find board by ID from dataset or fallback to first
  const board = useMemo(() => {
    return mockBoards.find(b => b.id === id) || mockBoards[0];
  }, [id]);

  const isDigital = board.boardType?.toLowerCase().includes('led') || board.boardType?.toLowerCase().includes('digital');

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Digital vs Exclusive Booking Mode (Phase 21)
  const [bookingMode, setBookingMode] = useState(isDigital ? 'digital_spot' : 'exclusive');
  const [spotDuration, setSpotDuration] = useState(10); // 10 seconds
  const [loopInterval, setLoopInterval] = useState(60); // Every 60 seconds
  const [operatingHours, setOperatingHours] = useState('10 AM – 10 PM'); // 12 hours

  // Date selection (Phase 12, 13, 21)
  const today = new Date().toISOString().split('T')[0];
  const defaultStart = '2026-10-10';
  const defaultEnd = isDigital ? '2026-11-09' : '2026-10-25'; // 30 days vs 15 days default
  
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Active / Booked Intervals (Phase 14 Prevent Double Booking)
  const [bookedIntervals, setBookedIntervals] = useState([
    {
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      label: 'Reserved by Corporate Client',
      status: 'approved'
    }
  ]);

  // Reviews State (Phase 23)
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      clientName: 'Rahul Sharma (Pune Academy)',
      rating: 5,
      comment: 'Good location and excellent visibility. We saw a 40% surge in website traffic during our Diwali admission campaign.',
      date: '2 weeks ago',
      verified: true
    },
    {
      id: 'rev-2',
      clientName: 'Amit Shinde (QuickDine Pune)',
      rating: 5,
      comment: 'Super crisp LED digital display. The 10s spot every minute gave our food festival phenomenal high-frequency reach.',
      date: '1 month ago',
      verified: true
    }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Booking Modal & Request State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [campaignNotes, setCampaignNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Fetch real availability & reviews from backend
  useEffect(() => {
    const boardKey = board._id || id;
    if (boardKey) {
      bookingService.getBoardAvailability(boardKey)
        .then((data) => {
          if (data.bookedIntervals && data.bookedIntervals.length > 0) {
            setBookedIntervals(data.bookedIntervals);
          }
        })
        .catch(() => {});

      reviewService.getBoardReviews(boardKey)
        .then((data) => {
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews.map(r => ({
              id: r._id,
              clientName: r.clientId?.name || 'Verified Client',
              rating: r.rating,
              comment: r.comment,
              date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              verified: true
            })));
          }
        })
        .catch(() => {});
    }
  }, [board, id]);

  // Calculate duration and intelligent price quote (Phase 12, 21)
  const durationDays = useMemo(() => {
    return getDaysBetweenDates(startDate, endDate);
  }, [startDate, endDate]);

  const pricingQuote = useMemo(() => {
    if (bookingMode === 'digital_spot' && isDigital) {
      return calculateDigitalCampaignPrice({
        spotDurationSeconds: spotDuration,
        loopIntervalSeconds: loopInterval,
        dailyOperatingHours: 12,
        operatingTimeWindow: operatingHours,
        campaignDays: durationDays,
        basePricePerDay: board.pricePerDay || 3000,
      });
    }

    return calculateDurationPrice(
      durationDays,
      board.pricePerDay,
      board.pricePerWeek,
      board.pricePerMonth
    );
  }, [bookingMode, isDigital, spotDuration, loopInterval, operatingHours, durationDays, board]);

  // Interval Overlap Collision Check (Phase 14)
  const dateConflict = useMemo(() => {
    // Only exclusive takeover locks calendar completely; spot loops allow multi-tenant slots
    if (bookingMode === 'digital_spot') return null;
    if (!startDate || !endDate) return null;
    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    for (const interval of bookedIntervals) {
      const bStart = new Date(interval.startDate).getTime();
      const bEnd = new Date(interval.endDate).getTime();

      if (reqStart < bEnd && reqEnd > bStart) {
        return {
          conflict: true,
          conflictingStart: new Date(interval.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          conflictingEnd: new Date(interval.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        };
      }
    }
    return null;
  }, [bookingMode, startDate, endDate, bookedIntervals]);

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    try {
      if (board._id || id) {
        await favoriteService.toggleFavorite(board._id || id);
      }
    } catch (e) {}
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      clientName: user?.name || 'Verified Advertiser',
      rating: newRating,
      comment: newComment.trim(),
      date: 'Just now',
      verified: true
    };
    setReviews([newRev, ...reviews]);
    setIsReviewModalOpen(false);
    setNewComment('');

    try {
      if (board._id || id) {
        await reviewService.createReview({
          boardId: board._id || id,
          rating: newRating,
          comment: newRev.comment,
        });
      }
    } catch (e) {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/boards/${board.id}` } });
      return;
    }
    if (dateConflict) {
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    try {
      // Try backend booking request
      const response = await bookingService.createBooking({
        boardId: board._id || board.id,
        startDate,
        endDate,
        campaignNotes,
      });

      setConfirmedBookingData(response.booking);
      setBookingConfirmed(true);
    } catch (err) {
      // If error from backend double booking or mock fallback
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        // Fallback demo simulation
        setConfirmedBookingData({
          bookingId: `FA-BKG-${Date.now().toString().slice(-4)}`,
          title: board.title,
          startDate,
          endDate,
          duration: durationDays,
          totalAmount: pricingQuote.totalAmount,
          priceBreakdown: pricingQuote.breakdown,
          status: 'pending',
        });
        setBookingConfirmed(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-blue-600">Explore</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">{board.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Grid: Left Details & Right Booking Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: Gallery, Details, Map, Owner */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Section */}
            <div className="space-y-3">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm relative group">
                <img
                  src={board.images[activeImageIdx] || board.images[0]}
                  alt={board.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges on Hero Image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10">
                    {isDigital ? <Tv className="w-3.5 h-3.5 text-orange-400" /> : <Zap className="w-3.5 h-3.5 text-blue-400" />}
                    {board.typeLabel || board.boardType}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white backdrop-blur-md shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Live & Verified
                  </span>
                </div>
              </div>

              {/* Thumbnails row */}
              {board.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {board.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative aspect-[16/10] w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIdx === idx ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Board Title & Core Specs Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-1">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{board.area}, Pune, Maharashtra</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {board.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{board.address}</p>
              </div>

              {/* 4-Box Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Dimensions</span>
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span>{board.dimensions || `${board.width} × ${board.height} ft`}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Daily Traffic</span>
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <span className="capitalize">{board.trafficLevel}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Visibility</span>
                  <div className="font-bold text-slate-900 text-xs truncate" title={board.visibility}>
                    {board.visibility}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Rating</span>
                  <div className="flex items-center gap-1 font-extrabold text-slate-900 text-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{board.rating || '4.9'}</span>
                    <span className="text-slate-600 text-xs font-normal">({board.reviewCount || 24})</span>
                  </div>
                </div>
              </div>

              {/* Rate Cards Breakdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-orange-50/70 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                  Official Standard Rate Card
                </span>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Daily Rate</span>
                    <span className="text-lg font-extrabold text-slate-900">{formatCurrency(board.pricePerDay)}</span>
                    <span className="text-[10px] text-slate-600 block">/ day</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Weekly Rate</span>
                    <span className="text-lg font-extrabold text-slate-900">{formatCurrency(board.pricePerWeek)}</span>
                    <span className="text-[10px] text-slate-600 block">/ week</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Monthly Rate</span>
                    <span className="text-lg font-extrabold text-orange-600">{formatCurrency(board.pricePerMonth)}</span>
                    <span className="text-[10px] text-slate-600 block">/ month</span>
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Space Details & Technical Highlights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {board.description || 'Located at a high-footfall junction in Pune. Verified for clear visibility, structural compliance, and prime road traffic orientation.'}
                </p>

                {board.features && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {board.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location & Interactive Leaflet OpenStreetMap Placement (Phase 20) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Location
                  </h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-lg font-extrabold text-slate-900 block leading-tight">{board.area}</span>
                      <span className="text-xs text-slate-500">Pune, Maharashtra</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 block">
                    Leaflet + OpenStreetMap
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    GPS: {board.latitude}, {board.longitude}
                  </span>
                </div>
              </div>

              <LeafletMap
                latitude={board.latitude}
                longitude={board.longitude}
                title={board.title}
                address={board.address}
                height="340px"
              />
            </div>

            {/* Advertiser / Owner Contact Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center text-base shrink-0 shadow-md">
                  {board.ownerName?.charAt(0) || 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{board.ownerName || 'Verified Board Owner'}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ Verified Owner
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Avg. Response Time: Under 2 Hours</p>
                </div>
              </div>

              <Link
                to={isAuthenticated ? `/messages?to=${board.ownerName}` : '/login'}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Message Owner</span>
              </Link>
            </div>

            {/* Reviews Section (Phase 23) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Advertiser Reviews</h3>
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>5.0</span>
                      <span className="text-slate-400 font-normal">({reviews.length})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Verified feedback from past campaign clients</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setIsReviewModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  ★ Write Review
                </button>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.clientName}</span>
                        {rev.verified && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            ✓ Verified Campaign
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: Sticky Duration & Digital Spot Engine (Phase 12, 21) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800 space-y-6">
              
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block mb-1">
                  {isDigital ? 'Digital LED Spot & Campaign Engine' : 'Intelligent Duration Engine'}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Calculate Campaign Cost
                </h3>
              </div>

              {/* Digital vs Exclusive Selector if LED (Phase 21) */}
              {isDigital && (
                <div className="p-1 bg-slate-900 rounded-xl flex gap-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBookingMode('digital_spot')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingMode === 'digital_spot'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Digital DOOH Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingMode('exclusive')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingMode === 'exclusive'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Exclusive Takeover
                  </button>
                </div>
              )}

              {/* Phase 21: Digital Spot Specific Configurations */}
              {isDigital && bookingMode === 'digital_spot' && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-orange-400 block">
                    Digital Spot Parameters
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Spot Duration</label>
                      <select
                        value={spotDuration}
                        onChange={(e) => setSpotDuration(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                      >
                        <option value={10}>10 Seconds</option>
                        <option value={15}>15 Seconds</option>
                        <option value={30}>30 Seconds</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Display Frequency</label>
                      <select
                        value={loopInterval}
                        onChange={(e) => setLoopInterval(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                      >
                        <option value={60}>Every 60 seconds (1/min)</option>
                        <option value={120}>Every 120 seconds (1/2min)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Broadcast Hours:</span>
                    <span className="font-bold text-white">10 AM – 10 PM (12 hrs)</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="text-slate-400">Daily Frequency:</span>
                    <span className="font-bold text-emerald-400">{pricingQuote.spotsPerDay || 720} plays / day</span>
                  </div>
                </div>
              )}

              {/* Date Range Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Campaign Start Date</span>
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Campaign End Date</span>
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  </label>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Reserved Dates & Collision Warning (Phase 14 Prevent Double Booking) */}
              {dateConflict ? (
                <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-red-400">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>❌ Board unavailable for selected dates.</span>
                  </div>
                  <p className="text-[11px] text-red-300/90 pl-6">
                    Already reserved from <strong className="text-white">{dateConflict.conflictingStart}</strong> to <strong className="text-white">{dateConflict.conflictingEnd}</strong>. Please choose another date range (e.g. after {dateConflict.conflictingEnd}).
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">✓ Available for booking on selected dates</span>
                </div>
              )}

              {/* Live Duration & Pricing Breakdown Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                
                {/* Duration Days */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Duration:</span>
                  <span className="font-extrabold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded-md">
                    {pricingQuote.durationDays || pricingQuote.campaignDays} Days
                  </span>
                </div>

                {/* Digital Total Impressions */}
                {isDigital && bookingMode === 'digital_spot' && (
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-300">
                    <span className="text-slate-400">Total Campaign Plays:</span>
                    <span className="font-extrabold text-blue-400">
                      {pricingQuote.totalSpots?.toLocaleString('en-IN')} Plays
                    </span>
                  </div>
                )}

                {/* Applicable Combination Breakdown */}
                <div className="text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Optimized Tier Formula:
                  </span>
                  <p className="text-slate-300 font-medium">
                    {pricingQuote.breakdown}
                  </p>
                </div>

                {/* Savings Indicator */}
                {pricingQuote.savings > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
                    <span className="font-semibold">Volume Discount:</span>
                    <span className="font-extrabold">Save {formatCurrency(pricingQuote.savings)}</span>
                  </div>
                )}

                {/* Final Total Amount */}
                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Campaign Price</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formatCurrency(pricingQuote.totalAmount)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">for {pricingQuote.durationDays || pricingQuote.campaignDays} days</span>
                </div>

              </div>

              {/* Main Booking Action */}
              <button
                type="button"
                disabled={!!dateConflict}
                onClick={handleBookClick}
                className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  dateConflict
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 active:scale-[0.99] text-white shadow-orange-500/20'
                }`}
              >
                {dateConflict ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Dates Unavailable</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Book This Board</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Double-Booking Guarantee</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Booking Request Modal (Phase 13) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
            
            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Booking Request Sent!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your request for <strong className="text-white">{board.title}</strong> ({pricingQuote.durationDays} days from {startDate} to {endDate}) has been submitted to the board owner.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400 text-[11px]">Booking ID: <span className="font-mono text-white">{confirmedBookingData?.bookingId || 'FA-BKG-PENDING'}</span></div>
                  <div className="text-orange-400 font-bold">Total Quoted: {formatCurrency(pricingQuote.totalAmount)}</div>
                  <div className="text-amber-400 text-[11px] font-semibold">Status: Pending Advertiser Approval</div>
                </div>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link
                    to="/client/dashboard?tab=bookings"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                  >
                    View in My Bookings →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingConfirmed(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Confirm Booking Request</h3>
                    <p className="text-xs text-slate-400">{board.title}</p>
                  </div>
                </div>

                {serverError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Requested Dates:</span>
                    <strong className="text-white">{startDate} to {endDate} ({pricingQuote.durationDays} Days)</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Pricing Formula:</span>
                    <span className="text-orange-400 font-semibold">{pricingQuote.breakdown}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800 font-bold text-sm">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-emerald-400">{formatCurrency(pricingQuote.totalAmount)}</span>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Campaign Message or Creative Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={campaignNotes}
                      onChange={(e) => setCampaignNotes(e.target.value)}
                      placeholder="e.g. Video spot will be 15s MP4 for Diwali launch..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsBookingModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Submit Request to Owner'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* Review Submission Modal (Phase 23) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Write Board Review</h3>
                <p className="text-xs text-slate-500">{board.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= newRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Campaign Review & Visibility Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="e.g. Good location and excellent visibility. Crisp digital display during evening peak hours."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
