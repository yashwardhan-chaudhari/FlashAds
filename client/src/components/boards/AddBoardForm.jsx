import React, { useState } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Tv, 
  Maximize2, 
  DollarSign, 
  Calendar, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Eye,
  Trash2,
  UploadCloud,
  Layers,
  Activity
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { puneAreas } from '../../data/mockBoards';
import BoardCard from '../common/BoardCard';

export default function AddBoardForm({ onBoardAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    boardType: 'hoarding',
    city: 'Pune',
    area: 'Hinjewadi',
    address: '',
    latitude: 18.5912,
    longitude: 73.7389,
    width: 30,
    height: 15,
    trafficLevel: 'high',
    visibility: 'Front Facing - Lit at Night',
    pricePerDay: 3500,
    pricePerWeek: 21000,
    pricePerMonth: 75000,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    ],
    availableFrom: '2026-10-01',
    availableUntil: '2027-04-30',
  });

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Area coordinates presets
  const handleAreaChange = (e) => {
    const area = e.target.value;
    let lat = 18.5204;
    let lng = 73.8567;

    if (area === 'Hinjewadi') { lat = 18.5912; lng = 73.7389; }
    else if (area.includes('FC Road')) { lat = 18.5246; lng = 73.8415; }
    else if (area === 'Viman Nagar') { lat = 18.5679; lng = 73.9143; }
    else if (area === 'Baner') { lat = 18.5590; lng = 73.7868; }
    else if (area === 'Kothrud') { lat = 18.5074; lng = 73.8077; }
    else if (area === 'Koregaon Park') { lat = 18.5362; lng = 73.8940; }
    else if (area === 'Wakad') { lat = 18.5987; lng = 73.7654; }

    setFormData({
      ...formData,
      area,
      latitude: lat,
      longitude: lng
    });
  };

  const handleAddImage = () => {
    if (customImageUrl.trim() && formData.images.length < 8) {
      setFormData({
        ...formData,
        images: [...formData.images, customImageUrl.trim()]
      });
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    if (formData.images.length <= 1) return;
    setFormData({
      ...formData,
      images: formData.images.filter((_, idx) => idx !== index)
    });
  };

  const handleAddPreset = (url) => {
    if (formData.images.length < 8) {
      setFormData({
        ...formData,
        images: [...formData.images, url]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a descriptive board title');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide a full street address or junction landmark');
      return;
    }
    if (formData.images.length === 0) {
      setErrorMessage('Please provide at least 1 image of the advertising space');
      return;
    }

    setIsSubmitting(true);

    const newBoardObject = {
      id: `b-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim() || `${formData.boardType} located at ${formData.address}, ${formData.area}, Pune.`,
      boardType: formData.boardType,
      typeLabel: formData.boardType === 'LED digital screen' ? 'LED Digital Screen' : formData.boardType.toUpperCase(),
      city: formData.city,
      area: formData.area,
      address: formData.address.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      width: Number(formData.width),
      height: Number(formData.height),
      dimensions: `${formData.width} × ${formData.height} ft`,
      trafficLevel: formData.trafficLevel,
      visibility: formData.visibility,
      pricePerDay: Number(formData.pricePerDay),
      pricePerWeek: Number(formData.pricePerWeek),
      pricePerMonth: Number(formData.pricePerMonth),
      images: formData.images,
      availableFrom: formData.availableFrom,
      availableUntil: formData.availableUntil,
      status: 'pending', // Starts as pending for Admin approval
      rejectionReason: '',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessBanner(true);
      if (onBoardAdded) {
        onBoardAdded(newBoardObject);
      }
    }, 600);
  };

  const previewBoardObject = {
    id: 'preview-1',
    title: formData.title || 'Your Board Title Preview',
    typeLabel: formData.boardType === 'LED digital screen' ? 'LED Digital Screen' : formData.boardType,
    boardType: formData.boardType,
    area: formData.area,
    address: formData.address || 'Street Address, Pune',
    dimensions: `${formData.width || 30} × ${formData.height || 15} ft`,
    width: formData.width,
    height: formData.height,
    trafficLevel: formData.trafficLevel,
    visibility: formData.visibility,
    pricePerDay: formData.pricePerDay,
    pricePerWeek: formData.pricePerWeek,
    pricePerMonth: formData.pricePerMonth,
    rating: 5.0,
    reviewCount: 0,
    images: formData.images
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>List New Advertising Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Add Advertising Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Fill in the specs, location, duration pricing, and photos. Every submission is reviewed by FlashAds Admin to ensure marketplace quality.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:text-white cursor-pointer shrink-0"
        >
          <Eye className="w-4 h-4 text-orange-400" />
          <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
        </button>
      </div>

      {/* Live Preview Drawer if toggled */}
      {showPreview && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Live Card Preview (Explore view)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Preview Mode</span>
          </div>
          <div className="max-w-md mx-auto">
            <BoardCard board={previewBoardObject} />
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successBanner && (
        <div className="p-6 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Board Submitted for Moderation!</h3>
              <p className="text-xs text-emerald-300">
                Status: <strong className="text-white">Pending Admin Review</strong>. Once verified, it will appear publicly on Explore.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(false)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Got it
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Add Board Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        
        {/* Section 1: Board Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Board Information</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Board Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hinjewadi Phase 1 Prime 4K LED Screen"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Board Format / Type *
              </label>
              <select
                value={formData.boardType}
                onChange={(e) => setFormData({ ...formData, boardType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="hoarding">Traditional Hoarding</option>
                <option value="LED digital screen">LED Digital Screen (DOOH)</option>
                <option value="unipole">Unipole Billboard</option>
                <option value="gantry">Overhead Gantry</option>
                <option value="bus shelter">Bus Shelter</option>
                <option value="banner">Commercial Banner</option>
                <option value="other">Other Outdoor Space</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Target Audience / Visibility Lighting
              </label>
              <input
                type="text"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                placeholder="e.g. Front Facing - Lit at Night (LED Spotlights)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe line of sight, junction traffic dwell times, commuter demographics, video format capabilities..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">2</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Location & Coordinates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                City
              </label>
              <input
                type="text"
                disabled
                value={formData.city}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Area / Locality *
              </label>
              <select
                value={formData.area}
                onChange={handleAreaChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {puneAreas.filter(a => a !== 'All Areas').map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Full Street Address / Landmark *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Near Infosys Circle, Phase 1, Hinjewadi, Pune 411057"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Latitude (OpenStreetMap Coordinate)
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Longitude (OpenStreetMap Coordinate)
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Size & Visibility */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">3</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Dimensions & Traffic</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Width (feet) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Height (feet) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Traffic Volume Level *
              </label>
              <select
                value={formData.trafficLevel}
                onChange={(e) => setFormData({ ...formData, trafficLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="very high">Very High (150k+ daily impressions)</option>
                <option value="high">High (80k–150k daily impressions)</option>
                <option value="medium">Medium (40k–80k daily impressions)</option>
                <option value="low">Low (under 40k daily)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Pricing */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">4</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Pricing Rate Cards (INR ₹)</h2>
          </div>

          <p className="text-xs text-slate-400">
            Configure rates across all 3 tiers. The pricing engine uses these to compute the cheapest valid totals for client bookings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price per Day (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Short term 1–6 day bookings</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price per Week (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.pricePerWeek}
                onChange={(e) => setFormData({ ...formData, pricePerWeek: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">7-day campaign pack</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price per Month (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">30-day campaign pack</span>
            </div>
          </div>
        </div>

        {/* Section 5: Images */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">5</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Board Images (1 to 8 photos)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 group">
                <img src={img} alt={`Board ${idx + 1}`} className="w-full h-full object-cover" />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-red-400 hover:text-white cursor-pointer opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="absolute bottom-1.5 left-2 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white font-mono">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Paste high-res image URL (JPG, PNG, WebP)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
            >
              + Add Image URL
            </button>
          </div>

          {/* Quick presets for rapid testing */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Quick Demo Presets:</span>
            {[
              { label: 'LED Night Screen', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
              { label: 'High Street Unipole', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80' },
              { label: 'Highway Gantry', url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1200&q=80' }
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddPreset(p.url)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 6: Availability */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-extrabold flex items-center justify-center">6</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Availability Window</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Available From *
              </label>
              <input
                type="date"
                required
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Available Until (Optional)
              </label>
              <input
                type="date"
                value={formData.availableUntil}
                onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Review Gate: New listings start as Pending</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Publishing Board...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Publish Board for Approval</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
