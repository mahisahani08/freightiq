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
      { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert, badge: 'Live' },
      { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'Sandbox' },
    ]
  },
  {
    title: 'Engineering & Audit',
    items: [
      { id: 'models', label: 'Model Benchmarks', icon: Cpu, badge: 'R² 0.908' },
      { id: 'data', label: 'Data & Audit Trail', icon: Database, badge: '18k+' },
      { id: 'about', label: 'SIH26006 Brief', icon: FileText, badge: 'SAIL' },
    ]
  }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 bg-[#081325] border-r border-[#152747] flex flex-col shrink-0 select-none shadow-2xl z-40">
      {/* Brand & SAIL Identity */}
      <div className="h-16 px-4 border-b border-[#152747] flex items-center space-x-3 bg-[#060e1d]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 shrink-0">
          <Ship className="w-5 h-5 text-cyan-100" />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-white text-base tracking-tight flex items-center space-x-1.5">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              FreightIQ
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-400/30 font-mono font-bold">
              v2.4
            </span>
          </div>
          <p className="text-[11px] text-cyan-200/60 truncate font-medium">Ministry of Steel • SAIL</p>
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
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/60 font-bold pl-3.5'
                      : 'text-slate-300 hover:text-white hover:bg-[#112340]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400/80'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[#12233f] text-cyan-300 border border-cyan-900/50'
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

      {/* Bottom Telemetry Box */}
      <div className="p-3 border-t border-[#152747] bg-[#060e1d]">
        <div className="bg-[#0b1c38] rounded-xl p-2.5 border border-cyan-900/40 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-cyan-300 font-bold">
            <span className="flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fleet Dispatch Hub</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/30">
              Active
            </span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Monitoring 7 East Coast discharge berths & 6 overseas bulk origins.
          </div>
        </div>
      </div>
    </aside>
  );
}
