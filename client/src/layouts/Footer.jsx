import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Tv,
  CheckCircle,
  Building2,
  CalendarCheck
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-900/30 via-slate-900 to-orange-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-2 border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Your Campaign in 5 Minutes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to advertise on Pune's top outdoor spots?
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Compare transparent rates, check live date availability, and book directly from board owners without broker markups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>Explore Boards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=advertiser"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold border border-slate-700 transition-all"
            >
              <span>List Your Space</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" variant="full" theme="dark" showTagline={true} />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              FlashAds is Pune's leading two-sided marketplace for outdoor hoardings, high-street unipoles, and high-impact digital LED screens with backend-enforced date availability.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>FC Road & Hinjewadi Tech Corridor, Pune, MH 411057</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@flashads.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 (020) 2553-ADVERT</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/explore" className="text-slate-400 hover:text-white transition-colors">
                  Explore All Boards
                </Link>
              </li>
              <li>
                <Link to="/explore?type=LED+digital+screen" className="text-slate-400 hover:text-white transition-colors">
                  Digital LED Screens
                </Link>
              </li>
              <li>
                <Link to="/explore?type=hoarding" className="text-slate-400 hover:text-white transition-colors">
                  Highway Hoardings
                </Link>
              </li>
              <li>
                <Link to="/explore?type=unipole" className="text-slate-400 hover:text-white transition-colors">
                  Unipole Billboards
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  Duration Pricing Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Pune Prime Hubs */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Pune Locations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/explore?area=Hinjewadi" className="text-slate-400 hover:text-white transition-colors">
                  Hinjewadi IT Corridor
                </Link>
              </li>
              <li>
                <Link to="/explore?area=FC+Road" className="text-slate-400 hover:text-white transition-colors">
                  FC Road & Shivajinagar
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Viman+Nagar" className="text-slate-400 hover:text-white transition-colors">
                  Viman Nagar Airport Hub
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Kothrud" className="text-slate-400 hover:text-white transition-colors">
                  Kothrud & Karve Road
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Baner" className="text-slate-400 hover:text-white transition-colors">
                  Baner-Balewadi High Street
                </Link>
              </li>
              <li>
                <Link to="/explore?area=Koregaon+Park" className="text-slate-400 hover:text-white transition-colors">
                  Koregaon Park
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About FlashAds
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Client & Owner Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Guarantee Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FlashAds Inc. All rights reserved. Built for Pune, India.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Admin-Verified Boards
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              Zero Double-Booking Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
