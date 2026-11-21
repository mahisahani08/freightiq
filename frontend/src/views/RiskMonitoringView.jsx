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
  Bell
} from 'lucide-react';
import { fetchRiskProfile } from '../services/api';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRiskProfile();
        if (data && data.overall_risk_score !== undefined) {
          setRiskData(data);
        }
      } catch (err) {
        console.error('Background risk refresh error (using default data):', err);
      }
    }
    load();
  }, []);

  const overallScore = riskData.overall_risk_score ?? 58;
  const overallCategory = riskData.overall_risk_category ?? 'MEDIUM';
  const volatility = riskData.historical_volatility_30d_pct ?? 14.2;
  const alerts = riskData.active_alerts || [];
  const breakdownEntries = Object.entries(riskData.risk_breakdown || {});

  return (
    <div className="space-y-6">
      {/* Header Context Bar */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-rose-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Multi-Factor Maritime Risk & Volatility Intelligence</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Composite index evaluating ocean freight rate volatility, berth congestion risk, bunker fuel trends, and seasonal disruption corridors.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200 font-bold">
            30-Day Volatility: ±{volatility}%
          </span>
        </div>

        {/* Risk Index Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Composite Risk Score</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {overallScore}
              </span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full ${
                  overallScore > 60
                    ? 'bg-rose-500'
                    : overallScore > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Overall Risk Level</span>
            <div className="text-2xl font-extrabold font-mono pt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  overallCategory === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : overallCategory === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {overallCategory} SEVERITY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Threshold monitored every 24 hours</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Primary Threat Factor</span>
            <div className="text-sm font-extrabold text-slate-900 pt-1">
              East Coast Port Congestion (Haldia / Paradip)
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Pre-berthing delay exceeds 96 hours</p>
          </div>
        </div>
      </div>

      {/* Active Operational Alerts */}
      {alerts.length > 0 && (
        <div className="fi-card p-5 space-y-3 border-t-4 border-t-amber-500">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Active Operational Bulletins & Notices</span>
          </h3>
          <div className="space-y-2">
            {alerts.map((al, idx) => (
              <div key={idx} className="flex items-start space-x-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{al}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Risk Factors Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Individual Maritime Risk Vectors & Mitigation Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdownEntries.map(([key, factor]) => {
            const title = FACTOR_TITLE_MAP[key] || key.replace(/_/g, ' ').toUpperCase();
            const category = factor.category || 'MEDIUM';
            const score = factor.score || 50;

            return (
              <div key={key} className="fi-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{title}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        category === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : category === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {category} ({score} / 100)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {factor.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-2xl text-[11px] text-slate-700">
                  <strong className="text-slate-900">Key Metric / Mitigation:</strong> {factor.metrics || 'Continuous monitoring'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
