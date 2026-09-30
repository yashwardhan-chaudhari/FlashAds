import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Maximize2, 
  Activity, 
  Star, 
  Calendar, 
  Eye, 
  Zap, 
  ArrowRight,
  Tv,
  Sparkles,
  Heart
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function BoardCard({ board }) {
  const [selectedRate, setSelectedRate] = useState('month'); // 'day' | 'week' | 'month'
  const [isFav, setIsFav] = useState(false);

  const getPrice = () => {
    switch (selectedRate) {
      case 'day':
        return { amount: board.pricePerDay, period: '/ day' };
      case 'week':
        return { amount: board.pricePerWeek, period: '/ week' };
      case 'month':
      default:
        return { amount: board.pricePerMonth, period: '/ month' };
    }
  };

  const { amount, period } = getPrice();

  const isDigital = board.boardType?.toLowerCase().includes('led') || board.boardType?.toLowerCase().includes('digital');

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Media & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={board.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
          alt={board.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            isDigital 
              ? 'bg-blue-600/90 text-white' 
              : 'bg-slate-900/80 text-slate-100 border border-white/10'
          }`}>
            {isDigital ? <Tv className="w-3 h-3 text-orange-400" /> : <Zap className="w-3 h-3 text-blue-400" />}
            {board.typeLabel || board.boardType}
          </span>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Available
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFav(!isFav);
              }}
              title="Save to favorites"
              className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isFav
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60 hover:text-red-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Area & Rating in Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">{board.area}, Pune</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-xs font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{board.rating || '4.8'}</span>
            <span className="text-white/70 font-normal text-[10px]">({board.reviewCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/boards/${board.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 transition-colors line-clamp-1 mb-2">
              {board.title}
            </h3>
          </Link>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{board.dimensions || `${board.width} × ${board.height} ft`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate capitalize">{board.trafficLevel} Traffic</span>
            </div>
          </div>
        </div>

        {/* Price & Duration Tier Selector */}
        <div className="pt-3 border-t border-slate-100">
          {/* Rate Selector Pills */}
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-lg mb-3">
            {[
              { key: 'day', label: 'Day' },
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedRate(tab.key)}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${
                  selectedRate === tab.key
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Price Display + Action Button */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 block">
                Standard Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {formatCurrency(amount)}
                </span>
                <span className="text-xs text-slate-600 font-medium">{period}</span>
              </div>
            </div>

            <Link
              to={`/boards/${board.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all"
            >
              <span>View & Book</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
