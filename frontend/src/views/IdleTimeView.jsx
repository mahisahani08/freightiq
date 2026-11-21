import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  Ship,
  Anchor,
  Check,
  ArrowRight,
  TrendingDown,
  Layers,
  DollarSign,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { analyzeIdleTime } from '../services/api';

const PORTS = ['Paradip', 'Visakhapatnam', 'Gangavaram', 'Dhamra', 'Gopalpur', 'Haldia'];
const VESSEL_CLASSES = ['Capesize', 'Panamax', 'Supramax', 'Handysize'];

const DAILY_DEMURRAGE_RATES = {
  Capesize: 28500,
  Panamax: 16200,
  Supramax: 13800,
  Handysize: 11400
};

export default function IdleTimeView() {
  const [portName, setPortName] = useState('Paradip');
  const [vesselClass, setVesselClass] = useState('Capesize');
  const [cargoQty, setCargoQty] = useState(75000);

  const [idleData, setIdleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzeIdleTime({
        port_name: portName,
        vessel_class: vesselClass,
        cargo_quantity_mt: Number(cargoQty)
      });
      setIdleData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [portName, vesselClass, cargoQty]);

  const dailyDemurrage = DAILY_DEMURRAGE_RATES[vesselClass] || 28500;
  const waitingHours = idleData?.estimated_waiting_hours ?? 48;
  const turnaroundHours = idleData?.total_turnaround_days ? (idleData.total_turnaround_days * 24).toFixed(0) : '72';
  const dischargeHours = idleData?.estimated_discharge_hours ?? 24;
  const demurrageCost = idleData?.demurrage_exposure_usd ?? 0;
  const occupancyRate = idleData?.berth_occupancy_rate ?? 0.75;
  const congestionLevel = idleData?.congestion_level ?? 'MODERATE';
  const laytimeHours = idleData?.estimated_discharge_days ? ((idleData.estimated_discharge_days + 0.5) * 24).toFixed(0) : '48';
  const alternatives = idleData?.alternative_ports_suggested || [];
  const mitigations = idleData?.mitigation_options || [];

  return (
    <div className="space-y-6">
      {/* Parameter Control Form */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-amber-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Vessel Idle-Time & Demurrage Liability Analyzer</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Queuing simulation calculating anchorage waiting hours, mechanized discharge rates, and demurrage exposure.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold">
            Laytime Standard: CQD 35,000 MT/Day
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Destination Port</label>
            <select
              value={portName}
              onChange={(e) => setPortName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
            >
              {PORTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Vessel Category</label>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Cargo Quantity (MT)</label>
            <input
              type="number"
              step="5000"
              value={cargoQty}
              onChange={(e) => setCargoQty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      {idleData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="fi-card p-4 space-y-1.5 border-t-4 border-t-amber-500">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pre-Berthing Wait</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {waitingHours}
              </span>
              <span className="text-xs text-slate-500 font-medium">hours ({(waitingHours / 24).toFixed(1)}d)</span>
            </div>
            <p className="text-[11px] text-amber-700 font-semibold pt-1 border-t border-slate-100">
              Anchorage Queue Depth: {congestionLevel}
            </p>
          </div>

          <div className="fi-card p-4 space-y-1.5 border-t-4 border-t-blue-600">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Port Turnaround</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {turnaroundHours}
              </span>
              <span className="text-xs text-slate-500 font-medium">hours</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Discharge Time: <strong>{dischargeHours} hrs</strong>
            </p>
          </div>

          <div className="fi-card p-4 space-y-1.5 border-t-4 border-t-rose-500">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Demurrage Burn Rate</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-rose-700 font-mono">
                ${dailyDemurrage.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ day</span>
            </div>
            <p className="text-[11px] text-rose-700 font-semibold pt-1 border-t border-slate-100">
              Liability for excess laytime
            </p>
          </div>

          <div className="fi-card p-4 space-y-1.5 border-t-4 border-t-purple-500">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Demurrage Risk</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-purple-700 font-mono">
                ${demurrageCost.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Laytime Allowed: <strong>{laytimeHours} hrs</strong>
            </p>
          </div>
        </div>
      )}

      {/* Port Congestion Gauge & Risk Memo */}
      {idleData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Congestion Gauge Card */}
          <div className="fi-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Berth Congestion Gauge
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Berth Occupancy Ratio:</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {(occupancyRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    occupancyRate > 0.8
                      ? 'bg-rose-500'
                      : occupancyRate > 0.6
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${occupancyRate * 100}%` }}
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Port Tested:</span>
                  <strong className="text-slate-900">{idleData.port_name}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Queuing Risk:</span>
                  <strong className={congestionLevel === 'CRITICAL' || congestionLevel === 'HIGH' ? 'text-rose-700' : 'text-slate-900'}>
                    {congestionLevel}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Queue Vessels:</span>
                  <strong className="text-slate-900">{idleData.current_queue_vessels || 3} vessels</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Risk Memo */}
          <div className="lg:col-span-2 fi-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Operational Idle-Time Intelligence Memo & Mitigations</span>
            </h3>

            <div className="space-y-2">
              {mitigations.map((opt, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>

            {/* Alternative Feasible Port Diversions */}
            {alternatives.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Alternative Port Diversion Options (Demurrage Arbitrage)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alternatives.map((alt, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>{alt.port_name}</span>
                        <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Wait: {(alt.waiting_days * 24).toFixed(0)} hrs
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Demurrage Savings: <strong className="text-emerald-700 font-mono">+${(alt.potential_idle_savings_usd || 0).toLocaleString()}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Max Draft: {alt.draft_m}m • {alt.rail_connectivity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
