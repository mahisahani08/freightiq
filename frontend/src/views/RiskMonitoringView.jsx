import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Activity,
  Fuel,
  Compass,
  CheckCircle2,
  Wind,
  Bell,
  Play,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { fetchRiskProfile, fetchMonteCarloSimulation } from '../services/api';

const DEFAULT_RISK_DATA = {
  overall_risk_score: 57.6,
  overall_risk_category: "MEDIUM",
  historical_volatility_30d_pct: 14.2,
  bunker_fuel_trend: "STABLE_SIDEWAYS",
  active_alerts: [
    "Port Alert: Haldia lock gate maintenance scheduled; anticipate +1.5 days additional pre-berthing wait.",
    "Fleet Alert: Capesize tonnage tight in Singapore-Bay of Bengal ballast leg; spot prompts commanding $1,200/day premium.",
    "Logistics Alert: SE Railway rake availability at Paradip increased by 8 rakes/day, accelerating evacuation."
  ],
  risk_breakdown: {
    market_volatility: {
      score: 64.0,
      category: "MEDIUM",
      description: "Baltic Dry sub-indices experiencing moderate 30-day oscillation due to raw material trade dynamics.",
      metrics: "30-Day Rate Standard Deviation: ±$2.85/MT"
    },
    port_congestion: {
      score: 72.0,
      category: "HIGH",
      description: "Berth occupancy running above 85% at Haldia and Paradip with pre-berthing queues averaging 3.5 days.",
      metrics: "Peak demurrage exposure: $32,000/day for Capesize"
    },
    weather_seasonality: {
      score: 42.0,
      category: "LOW",
      description: "Dry northeast monsoon corridor; favorable sea states in Bay of Bengal with minimal sea swell delay.",
      metrics: "Monsoon Factor: OFF, Cyclone Alert Level: GREEN"
    },
    bunker_fuel_cost: {
      score: 58.0,
      category: "MEDIUM",
      description: "Singapore VLSFO benchmark trading stably at $635/MT with low refining crack spread volatility.",
      metrics: "BAF sensitivity: $0.15/MT per $10 crude shift"
    },
    geopolitical_chokepoints: {
      score: 52.0,
      category: "MEDIUM",
      description: "Suez rerouting adds steaming days for US/European coal; Malacca & Sunda straits open with normal transit times.",
      metrics: "US East Coast via Cape of Good Hope: +10 steaming days"
    }
  }
};

const FACTOR_TITLE_MAP = {
  market_volatility: 'Ocean Freight Rate Volatility',
  port_congestion: 'Berth Congestion & Waiting Queues',
  weather_seasonality: 'Cyclone & Monsoon Seasonality',
  bunker_fuel_cost: 'VLSFO Bunker Fuel Price Risk',
  geopolitical_chokepoints: 'Geopolitical & Route Chokepoints'
};

export default function RiskMonitoringView() {
  const [riskData, setRiskData] = useState(DEFAULT_RISK_DATA);
  const [mcLoading, setMcLoading] = useState(false);
  const [mcData, setMcData] = useState(null);
  const [vesselClass, setVesselClass] = useState('Capesize');
  const [destPort, setDestPort] = useState('Paradip');
  const [cargoQty, setCargoQty] = useState(150000);

  useEffect(() => {
    async function load() {
      try {
        const [rData, mSim] = await Promise.all([
          fetchRiskProfile().catch(() => null),
          fetchMonteCarloSimulation({
            vessel_class: vesselClass,
            dest_port: destPort,
            cargo_quantity_mt: cargoQty,
            iterations: 1000
          }).catch(() => null)
        ]);

        if (rData && rData.overall_risk_score !== undefined) {
          setRiskData(rData);
        }
        if (mSim) {
          setMcData(mSim);
        }
      } catch (err) {
        console.error('Error loading risk telemetry:', err);
      }
    }
    load();
  }, []);

  const runSimulation = async () => {
    setMcLoading(true);
    try {
      const data = await fetchMonteCarloSimulation({
        vessel_class: vesselClass,
        dest_port: destPort,
        cargo_quantity_mt: cargoQty,
        iterations: 1000
      });
      if (data) setMcData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setMcLoading(false);
    }
  };

  const overallScore = riskData?.overall_risk_score ?? 58;
  const overallCategory = riskData?.overall_risk_category ?? 'MEDIUM';
  const volatility = riskData?.historical_volatility_30d_pct ?? 14.2;
  const alerts = riskData?.active_alerts || [];
  const breakdownEntries = Object.entries(riskData?.risk_breakdown || {});

  return (
    <div className="space-y-6">
      {/* Header Context Bar */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-rose-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Multi-Factor Maritime Risk & Volatility Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live composite risk scoring, bunker volatility, congestion alerts, and 1,000-run Monte Carlo Value-at-Risk modeling.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/60 font-bold">
              30d Vol: {volatility}%
            </span>
            <span
              className={`text-xs font-mono font-extrabold px-3 py-1 rounded-xl border ${
                overallCategory === 'HIGH'
                  ? 'text-rose-300 bg-rose-950/60 border-rose-800/60'
                  : overallCategory === 'MEDIUM'
                  ? 'text-amber-300 bg-amber-950/60 border-amber-800/60'
                  : 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60'
              }`}
            >
              RISK INDEX: {overallScore}/100 ({overallCategory})
            </span>
          </div>
        </div>

        {/* Live Port & Fleet Bulletins */}
        <div className="bg-[#0a1410] border border-[#193324] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Bell className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Active Strategic Advisory Bulletins</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {alerts.map((al, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span className="leading-relaxed">{al}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Monte Carlo Stochastic Simulation Sandbox */}
      <div className="fi-card p-5 space-y-5 border-t-4 border-t-amber-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#193324] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                1,000-Iteration Stochastic Monte Carlo Risk Engine
              </h3>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                Geometric Brownian Motion + Gamma Queuing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulates 1,000 randomized voyage variations incorporating bunker price spikes, tidal swell hold-ups, and queue demurrage to determine 95% Value-at-Risk (VaR).
            </p>
          </div>

          {/* Quick Simulation Parameter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg font-bold bg-[#0a1410] border border-[#193324]"
            >
              <option value="Capesize">Capesize (175k MT)</option>
              <option value="Panamax">Panamax (75k MT)</option>
              <option value="Supramax">Supramax (55k MT)</option>
            </select>
            <select
              value={destPort}
              onChange={(e) => setDestPort(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg font-bold bg-[#0a1410] border border-[#193324]"
            >
              <option value="Paradip">Paradip Port</option>
              <option value="Dhamra">Dhamra Port</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
              <option value="Haldia">Haldia Port</option>
            </select>
            <button
              onClick={runSimulation}
              disabled={mcLoading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/60 cursor-pointer disabled:opacity-50 border border-emerald-400/30"
            >
              <Play className={`w-3.5 h-3.5 ${mcLoading ? 'animate-spin' : ''}`} />
              <span>{mcLoading ? 'Simulating...' : 'Run 1k Runs'}</span>
            </button>
          </div>
        </div>

        {mcData && (
          <div className="space-y-4">
            {/* Simulation KPI Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#0a1410] p-3.5 rounded-xl border border-[#193324]">
                <span className="text-slate-400 text-[10px] block font-bold uppercase">Mean Simulated Cost</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  ${mcData.mean_cost_per_mt_usd?.toFixed(2)}
                </span>
                <span className="text-slate-500 text-[10px] block mt-0.5">Std Dev: ±${mcData.std_dev_usd?.toFixed(2)}/MT</span>
              </div>

              <div className="bg-[#0a1410] p-3.5 rounded-xl border border-amber-800/40">
                <span className="text-amber-300 text-[10px] block font-bold uppercase">P95 Value-at-Risk (VaR)</span>
                <span className="text-xl font-extrabold text-amber-300 font-mono">
                  ${mcData.p95_var_usd?.toFixed(2)}
                </span>
                <span className="text-slate-400 text-[10px] block mt-0.5">95% of voyages complete under this rate</span>
              </div>

              <div className="bg-[#0a1410] p-3.5 rounded-xl border border-rose-800/40">
                <span className="text-rose-400 text-[10px] block font-bold uppercase">Total VaR Exposure</span>
                <span className="text-xl font-extrabold text-rose-300 font-mono">
                  ${(mcData.value_at_risk_95_total_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-slate-400 text-[10px] block mt-0.5">P99 Extreme: ${mcData.p99_worst_case_usd?.toFixed(2)}/MT</span>
              </div>

              <div className="bg-[#0a1410] p-3.5 rounded-xl border border-emerald-800/40">
                <span className="text-emerald-400 text-[10px] block font-bold uppercase">Budget Overrun Risk</span>
                <span className="text-xl font-extrabold text-emerald-300 font-mono">
                  {mcData.budget_overrun_probability_pct}%
                </span>
                <span className="text-slate-400 text-[10px] block mt-0.5">Probability cost &gt; mean benchmark</span>
              </div>
            </div>

            {/* Monte Carlo Probability Distribution Histogram */}
            <div className="bg-[#0a1410] p-4 rounded-xl border border-[#193324]">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  Cost Frequency Distribution (1,000 Iteration Histogram)
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  P5: ${mcData.p5_best_case_usd} • Median: ${mcData.p50_median_usd} • P95: ${mcData.p95_var_usd}
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mcData.distribution_bins || []} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162e20" />
                    <XAxis
                      dataKey="cost_bin"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1813',
                        borderColor: '#f59e0b',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '11px'
                      }}
                      formatter={(val) => [`${val} Voyages`, 'Iterations']}
                    />
                    <Bar dataKey="frequency" radius={[6, 6, 0, 0]}>
                      {(mcData.distribution_bins || []).map((entry, index) => {
                        const isTail = index >= 7;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isTail ? '#f43f5e' : index >= 4 ? '#f59e0b' : '#10b981'}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono italic">
                {mcData.key_risk_takeaway}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Factor Risk Gauge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {breakdownEntries.map(([key, factor]) => {
          const title = FACTOR_TITLE_MAP[key] || key;
          const score = factor.score || 50;
          const cat = factor.category || 'MEDIUM';

          const catColor =
            cat === 'HIGH'
              ? 'text-rose-400 bg-rose-950/60 border-rose-800/60'
              : cat === 'MEDIUM'
              ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
              : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';

          const barColor =
            cat === 'HIGH' ? 'bg-rose-500' : cat === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <div key={key} className="fi-card p-4 space-y-3 border-t-2 border-t-[#1f4530]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight">{title}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${catColor}`}>
                  {cat}
                </span>
              </div>

              {/* Score Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Factor Severity:</span>
                  <span className="text-white font-bold">{score}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[40px]">
                {factor.description}
              </p>

              <div className="pt-2 border-t border-[#193324] text-[11px] font-mono text-emerald-300">
                {factor.metrics}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
