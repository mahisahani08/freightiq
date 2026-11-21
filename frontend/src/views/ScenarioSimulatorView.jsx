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
  Legend
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
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
              <span>What-If Scenario Simulation Sandbox</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Stress-test operational scenarios: booking deferral, port diversions, vessel up/down-sizing, and bunker fuel shocks.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200 font-bold">
            Monte Carlo Sensitivities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Baseline Vessel</label>
            <select
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {VESSEL_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Parcel Size (MT)</label>
            <input
              type="number"
              step="5000"
              value={cargoMt}
              onChange={(e) => setCargoMt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Baseline Discharge Port</label>
            <select
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {DEST_PORTS.map((dp) => (
                <option key={dp} value={dp}>{dp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Deferral Window</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[7, 14, 28].map((d) => (
                <button
                  key={d}
                  onClick={() => setDeferDays(d)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    deferDays === d
                      ? 'bg-cyan-600 text-white shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Comparative Landed Cost per MT Across Alternative Scenarios
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Total expenditure per MT including freight + bunker + demurrage + lighterage</p>
            </div>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200 font-bold">
              Baseline: ${simResult.baseline_summary.base_cost_per_mt_usd.toFixed(2)} / MT
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simResult.scenarios}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="scenario_name" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} />
                <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="cost_per_mt_usd" fill="#0891b2" name="Landed Cost ($/MT)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scenario Option Cards */}
      {simResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {simResult.scenarios.map((sc) => {
            const isBase = sc.scenario_id === 'SCENARIO_BASE';
            const isSavings = sc.cost_variance_vs_base_usd < 0;
            return (
              <div
                key={sc.scenario_id}
                className={`fi-card p-4 flex flex-col justify-between space-y-3 ${
                  isBase ? 'border-2 border-cyan-600 shadow-md shadow-cyan-900/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{sc.scenario_name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      sc.risk_rating === 'LOW'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : sc.risk_rating === 'HIGH'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {sc.risk_rating}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold font-mono text-slate-900">
                    ${sc.cost_per_mt_usd.toFixed(2)}
                    <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">/ MT</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-tight">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className={`text-xs font-mono font-bold flex items-center justify-between ${
                    isBase
                      ? 'text-slate-500'
                      : isSavings
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}>
                    <span>Variance:</span>
                    <span>
                      {isBase ? '0.0%' : `${isSavings ? '-' : '+'}$${Math.abs(sc.cost_variance_vs_base_usd).toLocaleString()}`}
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
