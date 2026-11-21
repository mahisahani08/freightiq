import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { simulateScenarios } from '../services/api';

const VESSEL_OPTIONS = ['Capesize', 'Panamax', 'Supramax', 'Handysize'];
const DEST_PORTS = ['Paradip', 'Visakhapatnam', 'Gangavaram', 'Dhamra', 'Gopalpur', 'Haldia'];

export default function ScenarioSimulatorView() {
  const [cargoMt, setCargoMt] = useState(75000);
  const [vessel, setVessel] = useState('Capesize');
  const [origin, setOrigin] = useState('Hay Point');
  const [dest, setDest] = useState('Paradip');
  const [deferDays, setDeferDays] = useState(14);

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await simulateScenarios({
        baseline_cargo_mt: Number(cargoMt),
        baseline_vessel: vessel,
        baseline_origin: origin,
        baseline_dest: dest,
        bunker_price_delta_pct: 0.0,
        waiting_time_delta_days: 0.0,
        defer_charter_days: deferDays
      });
      setSimResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [cargoMt, vessel, origin, dest, deferDays]);

  return (
    <div className="space-y-6">
      {/* Parameter Control Form */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>What-If Scenario Simulation Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Stress-test operational scenarios: booking deferral, port diversions, vessel up/down-sizing, and bunker fuel shocks.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/60 font-bold">
            Monte Carlo Sensitivities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Baseline Vessel</label>
            <select
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:border-emerald-400 cursor-pointer"
            >
              {VESSEL_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Parcel Size (MT)</label>
            <input
              type="number"
              step="5000"
              value={cargoMt}
              onChange={(e) => setCargoMt(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Baseline Discharge Port</label>
            <select
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:border-emerald-400 cursor-pointer"
            >
              {DEST_PORTS.map((dp) => (
                <option key={dp} value={dp}>{dp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Deferral Window</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[7, 14, 28].map((d) => (
                <button
                  key={d}
                  onClick={() => setDeferDays(d)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    deferDays === d
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/40'
                      : 'bg-[#0a1410] text-slate-400 hover:text-white border border-[#193324]'
                  }`}
                >
                  +{d}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Cost Comparison Chart */}
      {simResult && (
        <div className="fi-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Comparative Landed Cost per MT Across Alternative Scenarios
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Total expenditure per MT including freight + bunker + demurrage + lighterage</p>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-xl border border-emerald-800/60 font-bold">
              Baseline: ${(simResult.baseline_summary?.base_cost_per_mt_usd || 0).toFixed(2)} / MT
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simResult.scenarios || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162e20" />
                <XAxis dataKey="scenario_name" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} />
                <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1813',
                    borderColor: '#10b981',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar dataKey="cost_per_mt_usd" fill="#10b981" name="Landed Cost ($/MT)" radius={[6, 6, 0, 0]}>
                  {(simResult.scenarios || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.cost_variance_vs_base_usd < 0 ? '#10b981' : entry.scenario_id === 'SCENARIO_BASE' ? '#f59e0b' : '#fbbf24'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scenario Option Cards */}
      {simResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {(simResult.scenarios || []).map((sc) => {
            const isBase = sc.scenario_id === 'SCENARIO_BASE';
            const isSavings = sc.cost_variance_vs_base_usd < 0;
            return (
              <div
                key={sc.scenario_id}
                className={`fi-card p-4 flex flex-col justify-between space-y-3 ${
                  isBase ? 'border-2 border-emerald-400 shadow-lg shadow-emerald-950/40 bg-[#0d2217]' : 'border-[#193324]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#193324] pb-2">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">{sc.scenario_name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      sc.risk_rating === 'LOW'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : sc.risk_rating === 'HIGH'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                    }`}>
                      {sc.risk_rating}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold font-mono text-white">
                    ${(sc.cost_per_mt_usd || 0).toFixed(2)}
                    <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">/ MT</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-tight">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#193324]">
                  <div className={`text-xs font-mono font-bold flex items-center justify-between ${
                    isBase
                      ? 'text-slate-400'
                      : isSavings
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}>
                    <span>Variance:</span>
                    <span>
                      {isBase ? '0.0%' : `${isSavings ? '-' : '+'}$${Math.abs(sc.cost_variance_vs_base_usd || 0).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
