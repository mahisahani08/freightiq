import React from 'react';
import { Calendar, Compass, TrendingUp, TrendingDown, Ship, Activity, Bell } from 'lucide-react';

export default function Navbar({ activePageTitle }) {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Breadcrumb Navigation & SAIL Identity */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-[11px] uppercase tracking-wide text-cyan-800">SAIL Central Command</span>
        </div>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-extrabold text-sm tracking-tight">{activePageTitle}</span>
      </div>

      {/* Live Market Ticker Tape */}
      <div className="hidden xl:flex items-center space-x-2 text-xs font-mono">
        <div className="flex items-center space-x-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 font-sans font-medium text-[11px]">VLSFO Bunker:</span>
          <span className="font-bold text-slate-900">$635.00/MT</span>
          <span className="text-[10px] text-emerald-600 font-bold">-0.8%</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 font-sans font-medium text-[11px]">BCI Capesize:</span>
          <span className="font-bold text-slate-900">2,420 pts</span>
          <TrendingUp className="w-3 h-3 text-emerald-600" />
        </div>
        <div className="flex items-center space-x-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 font-sans font-medium text-[11px]">Met Coal CFR:</span>
          <span className="font-bold text-slate-900">$278.50/MT</span>
        </div>
      </div>

      {/* Right Controls & Operational Status */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="hidden sm:flex items-center space-x-1.5 text-slate-600 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">{dateStr}</span>
        </div>

        <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-[11px]">Ensemble ML Active</span>
        </div>
      </div>
    </header>
  );
}
