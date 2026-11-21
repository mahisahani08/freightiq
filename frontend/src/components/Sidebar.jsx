import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Ship,
  Anchor,
  Compass,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
  Cpu,
  Database,
  FileText,
  ChevronRight,
  Navigation
} from 'lucide-react';

const navSections = [
  {
    title: 'Voyage Operations',
    items: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' },
      { id: 'forecast', label: 'Freight Forecasting', icon: TrendingUp, badge: 'ML 91%' },
      { id: 'vessel_opt', label: 'Vessel Optimization', icon: Ship, badge: 'Gatekeeper' },
      { id: 'charter', label: 'Charter Decision', icon: Compass, badge: 'Signal' },
    ]
  },
  {
    title: 'Port & Risk Analytics',
    items: [
      { id: 'ports', label: 'Port Infrastructure', icon: Anchor, badge: '7 Ports' },
      { id: 'idle_time', label: 'Idle & Demurrage', icon: Clock, badge: 'Queuing' },
      { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert, badge: 'Realtime' },
      { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'Sandbox' },
    ]
  },
  {
    title: 'Engineering & Audit',
    items: [
      { id: 'models', label: 'Model Benchmarks', icon: Cpu, badge: 'R² 0.908' },
      { id: 'data', label: 'Data & Audit Trail', icon: Database, badge: '18k+' },
      { id: 'about', label: 'System Overview & Docs', icon: FileText, badge: 'SAIL' },
    ]
  }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 bg-[#050a07] border-r border-[#14291e] flex flex-col shrink-0 select-none shadow-2xl z-40">
      {/* Brand & SAIL Identity */}
      <div className="h-16 px-4 border-b border-[#14291e] flex items-center space-x-3 bg-[#040806]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 shrink-0 border border-emerald-400/30">
          <Ship className="w-5 h-5 text-emerald-100" />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-white text-base tracking-tight flex items-center space-x-1.5">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
              FreightIQ
            </span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/50 font-mono font-bold">
              v2.4
            </span>
          </div>
          <p className="text-[11px] text-emerald-300/70 truncate font-medium">Ministry of Steel • SAIL</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/80 font-bold pl-3.5 border border-emerald-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-[#0d1a13]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#0f1f17] text-amber-300 border border-amber-900/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-[#14291e] bg-[#040806] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-200">SAIL Dispatch Central</span>
        </div>
        <span className="font-mono text-[10px] text-amber-400 font-bold">ACTIVE</span>
      </div>
    </aside>
  );
}
