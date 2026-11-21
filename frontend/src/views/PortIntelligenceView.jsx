import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Train,
  AlertTriangle,
  Compass,
  Ship,
  MapPin,
  CheckCircle2,
  Waves,
  ArrowRight
} from 'lucide-react';
import { fetchPortsData } from '../services/api';

export default function PortIntelligenceView() {
  const [portsData, setPortsData] = useState(null);
  const [selectedPort, setSelectedPort] = useState('Paradip');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPortsData();
        setPortsData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !portsData) {
    return (
      <div className="h-60 flex items-center justify-center text-xs text-slate-400">
        Loading port infrastructure data...
      </div>
    );
  }

  const port = portsData.east_coast_ports[selectedPort];

  return (
    <div className="space-y-6">
      {/* Port Switcher Bar with Rich Tabs */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-cyan-600" />
              <span>East Coast Indian Port Master & Navigational Gatekeeper</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified draft, LOA, beam restrictions, mechanized discharge rates, and rail rake connectivity for SAIL inbound bulk terminals.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold">
            Official Port Trust Master Handbooks
          </span>
        </div>

        {/* Port Segmented Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(portsData.east_coast_ports).map((pName) => {
            const isSelected = selectedPort === pName;
            return (
              <button
                key={pName}
                onClick={() => setSelectedPort(pName)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Anchor className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{pName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Port Detailed View */}
      {port && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Navigational & Physical Constraints */}
          <div className="fi-card p-5 space-y-4 border-t-4 border-t-blue-600">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{port.port_name} Terminal</h3>
                <span className="text-xs text-slate-500 font-medium">{port.region}</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200">
                {port.port_id}
              </span>
            </div>

            {/* Graphical Depth & LOA Meters */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-bold">Max Draft</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">{port.max_draft_m}m</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${port.max_draft_m >= 18.0 ? 'bg-cyan-600' : port.max_draft_m >= 14.0 ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{ width: `${(port.max_draft_m / 20.0) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-bold">Max LOA</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">{port.max_loa_m}m</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${(port.max_loa_m / 350.0) * 100}%` }} />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-bold">Max Beam</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">{port.max_beam_m}m</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-600" style={{ width: `${(port.max_beam_m / 60.0) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Anchorage Wait:</span>
                <span className="text-slate-900 font-bold">{port.typical_waiting_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Port Turnaround:</span>
                <span className="text-slate-900 font-bold">{port.avg_turnaround_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tidal Restriction:</span>
                <span className={port.tidal_restriction ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>
                  {port.tidal_restriction ? 'Tidal Draft Windows' : 'All-Weather Deep Draft'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lighterage Requirement:</span>
                <span className={port.requires_lighterage ? 'text-rose-800 font-bold' : 'text-emerald-800 font-bold'}>
                  {port.requires_lighterage ? 'Mandatory (Sandheads Anchorage)' : 'Direct Berth Capable'}
                </span>
              </div>
            </div>

            {/* Railway Rake Evacuation */}
            <div className="p-3.5 bg-gradient-to-br from-cyan-50/50 to-blue-50/40 rounded-xl border border-cyan-200 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 text-cyan-900 font-bold text-xs">
                <Train className="w-4 h-4 text-cyan-700" />
                <span>Railway Rake Evacuation Logistics</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {port.rail_connectivity}
              </p>
              <div className="flex justify-between text-xs text-slate-600 pt-1.5 border-t border-cyan-200/80 font-mono font-semibold">
                <span>Rake Evacuation Capacity:</span>
                <span className="text-cyan-950 font-extrabold">{port.railway_rake_capacity_tpd.toLocaleString()} TPD</span>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Mechanized Berths */}
          <div className="lg:col-span-2 fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Mechanized Bulk Cargo Berths
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Designated handling berths for coking coal, iron ore, and limestone</p>
              </div>
              <span className="text-xs font-mono text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-xl">
                {port.berths.length} Berths Operational
              </span>
            </div>

            <div className="space-y-3">
              {port.berths.map((b) => (
                <div key={b.berth_id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.berth_name}</h4>
                      <span className="text-xs text-cyan-700 font-mono font-semibold">{b.berth_id}</span>
                    </div>
                    <span className="text-xs text-cyan-950 font-extrabold font-mono bg-cyan-100/70 px-3 py-1 rounded-lg border border-cyan-300 shadow-xs">
                      {b.discharge_rate_tpd.toLocaleString()} MT / Day
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-semibold">Permissible Draft:</span>
                      <span className="font-extrabold text-slate-900 font-mono">{b.max_draft_m}m</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-semibold">Permissible LOA:</span>
                      <span className="font-extrabold text-slate-900 font-mono">{b.max_loa_m}m</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-semibold">Cargo Focus:</span>
                      <span className="font-bold text-slate-800">{b.handled_commodities.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Haldia Riverine Special Notice */}
            {port.requires_lighterage && (
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs space-y-1.5 text-amber-900">
                <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Mandatory Riverine Sandheads Lighterage Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Due to the Auckland and Jellingham riverine sandbar draft restrictions in the Hooghly estuary, Capesize vessels cannot enter Haldia Dock Complex fully laden. Mandatory lightering must be performed at Sagar Deepwater Anchorage (+ $4.85/MT tariff).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
