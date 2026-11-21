import React from 'react';
import {
  FileText,
  Award,
  Ship,
  Compass,
  Cpu,
  Database,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Code2,
  Anchor,
  TrendingUp,
  Server,
  Building2,
  Layers
} from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-6">
      {/* Enterprise Platform Header in Jade & Gold */}
      <div className="fi-card p-6 space-y-3 border-t-4 border-t-emerald-500 bg-gradient-to-r from-[#07130c] via-[#0d2116] to-[#0a1810]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-emerald-200 bg-emerald-950/80 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-800/60 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ministry of Steel (SAIL) • Central Procurement Platform</span>
            </span>
          </div>
          <span className="text-xs bg-[#0a1410] text-amber-300 px-3 py-1 rounded-full border border-[#193324] font-mono font-bold self-start sm:self-auto">
            Domain: Transportation, Port Navigational Logistics & Maritime AI
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          FreightIQ – Intelligent Maritime Freight Forecasting & Bulk Chartering Decision Support Platform
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
          <div>
            <strong className="text-white">Organization:</strong> Steel Authority of India Limited (SAIL)
          </div>
          <div>•</div>
          <div>
            <strong className="text-white">Deployment:</strong> Central Raw Material Division (RMD)
          </div>
          <div>•</div>
          <div>
            <strong className="text-white">Strategic Focus:</strong> Overseas Coking Coal & Metallurgical Flux Procurement
          </div>
        </div>
      </div>

      {/* 6 Core Functional Modules Compliance Grid */}
      <div className="fi-card p-6 space-y-4">
        <div className="border-b border-[#193324] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Core Operational Decision Support Architecture & Production Engines</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated machine learning and physical port gatekeeping system calibrated to SAIL East Coast blast furnace requirements.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
            6/6 Production Engines Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              module: 'Module 1: Intelligent Freight Forecasting',
              desc: 'Ensemble XGBoost + Random Forest time-series forecasting with walk-forward cross-validation. Generates short/medium forecasts with dynamic 80% & 95% confidence intervals.',
              status: 'Fully Calibrated (R² 0.9082)',
              icon: TrendingUp,
              color: 'text-emerald-400'
            },
            {
              module: 'Module 2: Smart Chartering Advisor',
              desc: 'Arbitrage decision model answering "Charter now vs Wait" with projected cost delta and explainable factor weights (XAI) across Spot, Defer, and Time-Charter fixtures.',
              status: 'Actionable Delta Output',
              icon: Compass,
              color: 'text-amber-400'
            },
            {
              module: 'Module 3: Vessel Optimization',
              desc: 'Evaluates Handysize, Supramax, Panamax, and Capesize bulkers. Calculates true landed cost per MT (freight + bunker + port dues + lighterage + demurrage).',
              status: 'Economic Scale Optimizer',
              icon: Ship,
              color: 'text-teal-400'
            },
            {
              module: 'Module 4: Port Intelligence Gatekeeper',
              desc: 'Physical navigational gatekeeper enforcing draft, LOA, beam, and berth limits across 7 Indian East Coast ports (Paradip, Vizag, Dhamra, Haldia, Gangavaram, Gopalpur, Sagar).',
              status: 'Physical Grounding Defense',
              icon: Anchor,
              color: 'text-emerald-400'
            },
            {
              module: 'Module 5: Vessel Idle-Time & Demurrage',
              desc: 'M/M/c queuing simulation calculating pre-berthing wait times, berth occupancy ratios, and demurrage exposure ($14,000–$32,000/day) with alternative port diversion.',
              status: 'Demurrage Risk Mitigation',
              icon: Cpu,
              color: 'text-amber-400'
            },
            {
              module: 'Module 6: Risk Intelligence & What-If Sandbox',
              desc: 'Multi-factor risk score (0-100) combining freight volatility, cyclone seasonality, port congestion, and bunker spikes with 1,000-run Monte Carlo simulation.',
              status: 'Interactive Sandbox',
              icon: ShieldCheck,
              color: 'text-rose-400'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-[#0a1410] p-4 rounded-xl border border-[#193324] space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <h3 className="text-xs font-bold text-white tracking-tight">{item.module}</h3>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#193324] flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack & Architecture Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tech Stack */}
        <div className="fi-card p-5 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Practical Enterprise Technology Stack</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#0a1410] rounded-xl border border-[#193324]">
              <strong className="text-white block mb-0.5">Frontend Dashboard:</strong>
              <span className="text-slate-300">React 19, Vite, Tailwind CSS v4, Recharts, Lucide React Icons. Bespoke Emerald Jade & Industrial Gold palette.</span>
            </div>
            <div className="p-2.5 bg-[#0a1410] rounded-xl border border-[#193324]">
              <strong className="text-white block mb-0.5">Backend REST APIs:</strong>
              <span className="text-slate-300">Python 3.12, FastAPI, Uvicorn, Pydantic data schemas, structured error handlers.</span>
            </div>
            <div className="p-2.5 bg-[#0a1410] rounded-xl border border-[#193324]">
              <strong className="text-white block mb-0.5">Machine Learning Pipeline:</strong>
              <span className="text-slate-300">Scikit-Learn, XGBoost, Pandas, NumPy. Walk-forward TimeSeriesSplit validation, Monte Carlo stochastic engine, and Admiralty cubic eco-steaming optimizer.</span>
            </div>
            <div className="p-2.5 bg-[#0a1410] rounded-xl border border-[#193324]">
              <strong className="text-white block mb-0.5">Database Layer:</strong>
              <span className="text-slate-300">Relational SQLite schema with audit logging. Ready for seamless migration to enterprise PostgreSQL.</span>
            </div>
          </div>
        </div>

        {/* Real-World Steel Authority of India (SAIL) Impact */}
        <div className="fi-card p-5 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Economic Impact for SAIL Blast Furnaces</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/50 space-y-1">
              <strong className="text-emerald-300 font-bold block">1. Ocean Freight Arbitrage:</strong>
              <p className="text-[11px] text-emerald-200/90">
                Timing coal purchases during predicted rate dips ($0.70–$1.50/MT softer window) saves <strong>$100,000 to $225,000 per Capesize voyage</strong> on 150,000 MT shipments.
              </p>
            </div>

            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/50 space-y-1">
              <strong className="text-amber-300 font-bold block">2. Demurrage Avoidance:</strong>
              <p className="text-[11px] text-amber-200/90">
                Directing vessels away from congested Haldia/Paradip berths to deepwater Gangavaram or Dhamra eliminates 3–5 days of idle waiting, saving <strong>$96,000 to $160,000 in demurrage liabilities</strong>.
              </p>
            </div>

            <div className="bg-teal-950/30 p-3 rounded-xl border border-teal-800/50 space-y-1">
              <strong className="text-teal-300 font-bold block">3. Sandheads Lighterage Gatekeeper:</strong>
              <p className="text-[11px] text-teal-200/90">
                Guarantees Capesize bulkers never draft-ground in the Hooghly river approach to Haldia by automatically factoring in mandatory offshore lightering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
