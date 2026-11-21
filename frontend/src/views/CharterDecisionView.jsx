import React, { useState, useEffect } from 'react';
import {
  Compass,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchCharterRecommendation } from '../services/api';

const VESSEL_CLASSES = ['Capesize', 'Panamax', 'Supramax', 'Handysize'];
const PORTS = ['Paradip', 'Visakhapatnam', 'Gangavaram', 'Dhamra', 'Gopalpur', 'Haldia'];

export default function CharterDecisionView() {
  const [vesselClass, setVesselClass] = useState('Capesize');
  const [cargoQty, setCargoQty] = useState(75000);
  const [destPort, setDestPort] = useState('Paradip');
  const [targetArrivalDays, setTargetArrivalDays] = useState(30);

  const [recData, setRecData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRecommendation = async () => {
    setLoading(true);
    try {
      const data = await fetchCharterRecommendation({
        cargo_quantity_mt: Number(cargoQty),
        commodity_type: 'Coking Coal',
        origin_port: 'Hay Point',
        destination_port: destPort,
        vessel_class: vesselClass,
        target_arrival_days: targetArrivalDays
      });
      setRecData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendation();
  }, [vesselClass, cargoQty, destPort, targetArrivalDays]);

  return (
    <div className="space-y-6">
      {/* Parameter Filter Bar */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-600" />
              <span>Smart Chartering Strategy & Timing Advisor</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates spot market momentum against short-term Time Charter (TC) daily hire rates and forward projections.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200 font-bold">
            Laycan Horizon: {targetArrivalDays} Days Forward
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Vessel Category</label>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Parcel Quantity (MT)</label>
            <input
              type="number"
              step="5000"
              value={cargoQty}
              onChange={(e) => setCargoQty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Discharge Port</label>
            <select
              value={destPort}
              onChange={(e) => setDestPort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {PORTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Laycan Window</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetArrivalDays(d)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    targetArrivalDays === d
                      ? 'bg-cyan-600 text-white shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Actionable Verdict Banner with Rich Visual Card */}
      {recData && (
        <div className={`rounded-2xl p-6 border-2 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
          recData.verdict === 'ENTER_SPOT_NOW'
            ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white border-emerald-500/80 shadow-emerald-950/20'
            : recData.verdict === 'DEFER_SPOT_BOOKING'
            ? 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white border-amber-500/80 shadow-amber-950/20'
            : 'bg-gradient-to-r from-[#081830] via-[#0d2a52] to-[#0a1f3c] text-white border-cyan-500/80 shadow-cyan-950/20'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                recData.verdict === 'ENTER_SPOT_NOW'
                  ? 'bg-emerald-500 text-white'
                  : recData.verdict === 'DEFER_SPOT_BOOKING'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 text-slate-950'
              }`}>
                VERDICT: {recData.verdict.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Confidence: <strong className="text-white">{recData.confidence_level}</strong>
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{recData.headline}</h3>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              {recData.actionable_takeaway}
            </p>
          </div>

          <div className="shrink-0 bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-right space-y-1 font-mono">
            <span className="text-[10px] text-slate-300 uppercase tracking-wide block font-sans font-bold">Contract Vehicle:</span>
            <span className="text-xs font-bold text-cyan-300 block">{recData.recommended_contract_type}</span>
            <div className="text-xs text-slate-300 pt-1.5 border-t border-white/10">
              <span>Expected Delta: </span>
              <strong className={`font-mono text-sm ${recData.expected_cost_delta_usd >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ${Math.abs(recData.expected_cost_delta_usd).toLocaleString()} USD
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Spot vs Projected Rates Grid */}
      {recData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="fi-card p-5 space-y-1 border-t-4 border-t-blue-600">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Prompt Spot Rate</div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              ${recData.current_spot_rate_usd.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/ MT</span>
            </div>
            <p className="text-xs text-slate-500 pt-1">Fixing today without delay under current index</p>
          </div>

          <div className="fi-card p-5 space-y-1 border-t-4 border-t-cyan-500">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">{targetArrivalDays}-Day Projected Forward</div>
            <div className="text-3xl font-extrabold text-cyan-700 font-mono">
              ${recData.forecasted_rate_usd_30d.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/ MT</span>
            </div>
            <p className="text-xs text-slate-500 pt-1">Expected arrival window weighted mean</p>
          </div>

          <div className="fi-card p-5 space-y-1 border-t-4 border-t-emerald-500">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Strategy Execution</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">
              {recData.verdict === 'ENTER_SPOT_NOW' && 'Immediate Spot Fixing'}
              {recData.verdict === 'DEFER_SPOT_BOOKING' && 'Stagger / Defer Tender'}
              {recData.verdict === 'LOCK_SHORT_TERM_TC' && 'Fix 30-Day Time Charter'}
            </div>
            <p className="text-xs text-emerald-700 font-bold pt-1">
              Projected margin impact: {recData.expected_savings_percentage}%
            </p>
          </div>
        </div>
      )}

      {/* Factor Attribution Breakdown */}
      {recData && (
        <div className="fi-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Explainable AI (XAI) • Factor Attribution & Decision Weights
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Underlying market drivers and weight percentages contributing to the charter verdict.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200 font-bold">
              Weight Total: 100%
            </span>
          </div>

          <div className="space-y-3">
            {recData.explainable_factors.map((f, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{f.factor_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      f.impact === 'BULLISH'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : f.impact === 'BEARISH'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {f.impact}
                    </span>
                  </div>
                  <span className="font-mono text-cyan-700 font-extrabold text-sm">{(f.weight * 100).toFixed(0)}% Weight</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      f.impact === 'BULLISH' ? 'bg-amber-500' : f.impact === 'BEARISH' ? 'bg-emerald-600' : 'bg-cyan-600'
                    }`}
                    style={{ width: `${f.weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
