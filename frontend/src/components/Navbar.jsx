import React, { useState, useEffect } from 'react';
import { Calendar, Compass, TrendingUp, TrendingDown, Ship, Waves, AlertTriangle } from 'lucide-react';
import { fetchMetoceanSeasonality } from '../services/api';

export default function Navbar({ activePageTitle }) {
  const [metocean, setMetocean] = useState(null);

  useEffect(() => {
    async function loadMetocean() {
      try {
        const data = await fetchMetoceanSeasonality();
        if (data) setMetocean(data);
      } catch (e) {
        // quiet fallback
      }
    }
    loadMetocean();
  }, []);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-[#09130e]/95 backdrop-blur-md border-b border-[#182f21] px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Breadcrumb Navigation & SAIL Identity */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-2 font-bold text-emerald-300 bg-[#0e1d15] px-3 py-1.5 rounded-lg border border-emerald-800/60 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-200">SAIL Maritime Command</span>
        </div>
        <span className="text-slate-600">/</span>
        <span className="text-white font-extrabold text-sm tracking-tight">{activePageTitle}</span>
      </div>

      {/* Live Market Ticker Tape */}
      <div className="hidden xl:flex items-center space-x-2.5 text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-slate-300 bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
          <span className="text-slate-400 font-sans font-medium text-[11px]">VLSFO Bunker:</span>
          <span className="font-bold text-white">$635.00/MT</span>
          <span className="text-[10px] text-emerald-400 font-bold">-0.8%</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-300 bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
          <span className="text-slate-400 font-sans font-medium text-[11px]">BCI Capesize:</span>
          <span className="font-bold text-amber-300">2,420 pts</span>
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex items-center space-x-1.5 text-slate-300 bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
          <span className="text-slate-400 font-sans font-medium text-[11px]">Met Coal CFR:</span>
          <span className="font-bold text-emerald-300">$278.50/MT</span>
        </div>
        {metocean && (
          <div className="flex items-center space-x-1.5 text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/50">
            <Waves className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-sans font-medium">Swell: {metocean.average_wave_swell_height_m}m</span>
          </div>
        )}
      </div>

      {/* Right Controls & Operational Status */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="hidden sm:flex items-center space-x-2 text-slate-300 font-mono bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200">{dateStr}</span>
        </div>

        <div className="flex items-center space-x-2 text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/70 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-bold text-[11px] tracking-wide">Ensemble ML Active</span>
        </div>
      </div>
    </header>
  );
}
