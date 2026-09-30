import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Tv, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Calendar, 
  X, 
  Check, 
  ArrowUpDown,
  Sparkles,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';
import BoardCard from '../components/common/BoardCard';
import { mockBoards, puneAreas } from '../data/mockBoards';
import { formatCurrency } from '../utils/formatters';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL or initial state
  const initialArea = searchParams.get('area') || 'All Areas';
  const initialType = searchParams.get('type') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedType, setSelectedType] = useState(initialType);
  const [trafficFilter, setTrafficFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all'); // 'all' | 'small' | 'medium' | 'large'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'newest'
  const [maxPrice, setMaxPrice] = useState(150000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and Sort Logic matching Phase 10 Specs
  const filteredBoards = useMemo(() => {
    return mockBoards.filter((board) => {
      // Area match
      if (selectedArea !== 'All Areas' && !board.area.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }
      // Board type match
      if (selectedType !== 'all') {
        const typeMatch = board.boardType.toLowerCase() === selectedType.toLowerCase() ||
          (selectedType === 'LED digital screen' && board.boardType.toLowerCase().includes('led'));
        if (!typeMatch) return false;
      }
      // Traffic level match
      if (trafficFilter !== 'all' && board.trafficLevel !== trafficFilter) {
        return false;
      }
      // Size filter match (sq ft)
      if (sizeFilter !== 'all') {
        const sqft = (board.width || 20) * (board.height || 10);
        if (sizeFilter === 'small' && sqft > 300) return false;
        if (sizeFilter === 'medium' && (sqft <= 300 || sqft > 600)) return false;
        if (sizeFilter === 'large' && sqft <= 600) return false;
      }
      // Price limit
      if (board.pricePerMonth > maxPrice) {
        return false;
      }
      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textMatch = board.title.toLowerCase().includes(q) ||
          board.address.toLowerCase().includes(q) ||
          board.area.toLowerCase().includes(q) ||
          board.boardType.toLowerCase().includes(q);
        if (!textMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerMonth - b.pricePerMonth;
      if (sortBy === 'price-high') return b.pricePerMonth - a.pricePerMonth;
      if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
      return 0; // featured default
    });
  }, [selectedArea, selectedType, trafficFilter, sizeFilter, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedArea('All Areas');
    setSelectedType('all');
    setTrafficFilter('all');
    setSizeFilter('all');
    setMaxPrice(150000);
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Explore Pune Marketplace</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Outdoor & Digital Ad Spaces
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Showing <strong className="text-slate-900">{filteredBoards.length}</strong> verified billboards across Pune
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="newest">Newest Listed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Top Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by area, road, landmark, or format (e.g. Hinjewadi IT Park, FC Road Unipole)..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Layout Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters Desktop */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Marketplace Filters</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Location / Area Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Pune Locality
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {puneAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Board Format / Type Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Board Type
                </label>
                <div className="space-y-1.5 text-xs font-medium text-slate-700">
                  {[
                    { id: 'all', label: 'All Board Types' },
                    { id: 'hoarding', label: 'Traditional Hoardings' },
                    { id: 'LED digital screen', label: 'LED Digital Screens' },
                    { id: 'unipole', label: 'Unipole Billboards' },
                    { id: 'gantry', label: 'Overhead Gantries' },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                        selectedType === type.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span>{type.label}</span>
                      <input
                        type="radio"
                        name="boardType"
                        value={type.id}
                        checked={selectedType === type.id}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-blue-600 focus:ring-0"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Traffic Level Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Traffic Level
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'Any Traffic' },
                    { id: 'very high', label: 'Very High' },
                    { id: 'high', label: 'High' },
                    { id: 'medium', label: 'Medium' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setTrafficFilter(lvl.id)}
                      className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        trafficFilter === lvl.id
                          ? 'bg-orange-500 text-white shadow-xs font-bold'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Range Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Structure Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'small', label: 'Small' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'large', label: 'Mega' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSizeFilter(sz.id)}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        sizeFilter === sz.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Budget Max Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label className="font-bold uppercase tracking-wider text-slate-500">
                    Max Monthly Budget
                  </label>
                  <span className="font-bold text-slate-900">{formatCurrency(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>₹20k/mo</span>
                  <span>₹1.5L/mo</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Boards List Grid */}
          <main className="lg:col-span-3">
            {filteredBoards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBoards.map((board) => (
                  <div key={board.id} className="flex flex-col">
                    <BoardCard board={board} />
                    <Link
                      to={`/boards/${board.id}`}
                      className="mt-2 text-center text-xs font-bold text-blue-600 hover:underline py-1"
                    >
                      View Space Details & Specs →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-md mx-auto my-12 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No advertising boards found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try adjusting your filters, clearing keywords, or selecting a broader Pune locality.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
