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
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Smart Chartering Strategy & Timing Advisor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates spot market momentum against short-term Time Charter (TC) daily hire rates and forward projections.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60 font-bold">
            Laycan Horizon: {targetArrivalDays} Days Forward
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Vessel Category</label>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:border-emerald-400 cursor-pointer"
            >
              {VESSEL_CLASSES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Parcel Quantity (MT)</label>
            <input
              type="number"
              step="5000"
              value={cargoQty}
              onChange={(e) => setCargoQty(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Discharge Port</label>
            <select
              value={destPort}
              onChange={(e) => setDestPort(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:border-emerald-400 cursor-pointer"
            >
              {PORTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Laycan Window</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setTargetArrivalDays(d)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    targetArrivalDays === d
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/40'
                      : 'bg-[#0a1410] text-slate-400 hover:text-white border border-[#193324]'
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
        <div className={`rounded-2xl p-6 border-2 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
          recData.verdict === 'ENTER_SPOT_NOW'
            ? 'bg-gradient-to-r from-emerald-950 via-[#0a2318] to-emerald-950 text-white border-emerald-500/80 shadow-emerald-950/30'
            : recData.verdict === 'DEFER_SPOT_BOOKING'
            ? 'bg-gradient-to-r from-amber-950 via-[#231b0e] to-amber-950 text-white border-amber-500/80 shadow-amber-950/30'
            : 'bg-gradient-to-r from-[#07140e] via-[#0d2217] to-[#07140e] text-white border-emerald-500/80 shadow-emerald-950/30'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                recData.verdict === 'ENTER_SPOT_NOW'
                  ? 'bg-emerald-500 text-white'
                  : recData.verdict === 'DEFER_SPOT_BOOKING'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-400 text-slate-950'
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

          <div className="shrink-0 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-right space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-sans font-bold">Contract Vehicle:</span>
            <span className="text-xs font-bold text-amber-300 block">{recData.recommended_contract_type}</span>
            <div className="text-xs text-slate-300 pt-1.5 border-t border-white/10">
              <span>Expected Delta: </span>
              <strong className={`font-mono text-sm ${recData.expected_cost_delta_usd >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ${Math.abs(recData.expected_cost_delta_usd || 0).toLocaleString()} USD
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Spot vs Projected Rates Grid */}
      {recData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="fi-card p-5 space-y-1 border-t-4 border-t-teal-500">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Prompt Spot Rate</div>
            <div className="text-3xl font-extrabold text-white font-mono">
              ${(recData.current_spot_rate_usd || 0).toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ MT</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">Fixing today without delay under current index</p>
          </div>

          <div className="fi-card p-5 space-y-1 border-t-4 border-t-amber-500">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">{targetArrivalDays}-Day Projected Forward</div>
            <div className="text-3xl font-extrabold text-amber-300 font-mono">
              ${(recData.forecasted_rate_usd_30d || 0).toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ MT</span>
            </div>
            <p className="text-xs text-slate-400 pt-1">Expected arrival window weighted mean</p>
          </div>

          <div className="fi-card p-5 space-y-1 border-t-4 border-t-emerald-500">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Strategy Execution</div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {recData.verdict === 'ENTER_SPOT_NOW' && 'Immediate Spot Fixing'}
              {recData.verdict === 'DEFER_SPOT_BOOKING' && 'Stagger / Defer Tender'}
              {recData.verdict === 'LOCK_SHORT_TERM_TC' && 'Fix 30-Day Time Charter'}
            </div>
            <p className="text-xs text-emerald-400 font-bold pt-1">
              Projected margin impact: {recData.expected_savings_percentage}%
            </p>
          </div>
        </div>
      )}

      {/* Factor Attribution Breakdown */}
      {recData && (
        <div className="fi-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#193324] pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Explainable AI (XAI) • Factor Attribution & Decision Weights
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Underlying market drivers and weight percentages contributing to the charter verdict.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-800/60 font-bold">
              Weight Total: 100%
            </span>
          </div>

          <div className="space-y-3">
            {(recData.explainable_factors || []).map((f, i) => (
              <div key={i} className="bg-[#0a1410] border border-[#193324] rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{f.factor_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      f.impact === 'BULLISH'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        : f.impact === 'BEARISH'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {f.impact}
                    </span>
                  </div>
                  <span className="font-mono text-amber-300 font-extrabold text-sm">{(f.weight * 100).toFixed(0)}% Weight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      f.impact === 'BULLISH' ? 'bg-amber-500' : f.impact === 'BEARISH' ? 'bg-emerald-500' : 'bg-teal-500'
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
