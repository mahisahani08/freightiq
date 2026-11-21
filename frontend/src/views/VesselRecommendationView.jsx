import React, { useState, useEffect } from 'react';
import {
  Ship,
  Anchor,
  Check,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Fuel,
  Clock,
  DollarSign,
  Maximize2,
  Waves
} from 'lucide-react';
import { optimizeVessel } from '../services/api';
import VesselDraftVisualizer from '../components/VesselDraftVisualizer';

const COMMODITIES = ['Coking Coal', 'Iron Ore', 'Limestone', 'Manganese Ore'];
const DEST_PORTS = ['Paradip', 'Visakhapatnam', 'Gangavaram', 'Dhamra', 'Gopalpur', 'Haldia'];
const ORIGINS = [
  { country: 'Australia', ports: ['Hay Point', 'Gladstone', 'Dalrymple Bay'] },
  { country: 'United States', ports: ['Hampton Roads', 'Baltimore'] },
  { country: 'Mozambique', ports: ['Maputo', 'Beira'] },
  { country: 'Russia', ports: ['Taman (Black Sea)', 'Ust-Luga', 'Vostochny'] },
  { country: 'Indonesia', ports: ['Taboneo', 'Samarinda'] },
];

const VESSEL_DWT_MAP = {
  Capesize: 180000,
  Panamax: 75000,
  Supramax: 58000,
  Handysize: 35000
};

export default function VesselRecommendationView() {
  const [commodity, setCommodity] = useState('Coking Coal');
  const [cargoQuantity, setCargoQuantity] = useState(75000);
  const [originCountry, setOriginCountry] = useState('Australia');
  const [originPort, setOriginPort] = useState('Hay Point');
  const [destPort, setDestPort] = useState('Paradip');

  const [optResult, setOptResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (countryName) => {
    setOriginCountry(countryName);
    const originObj = ORIGINS.find((o) => o.country === countryName);
    if (originObj && originObj.ports.length > 0) {
      setOriginPort(originObj.ports[0]);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    try {
      const data = await optimizeVessel({
        commodity_type: commodity,
        cargo_quantity_mt: Number(cargoQuantity),
        origin_country: originCountry,
        origin_port: originPort,
        destination_port: destPort,
        target_dispatch_days: 14
      });
      setOptResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization();
  }, [commodity, cargoQuantity, originCountry, originPort, destPort]);

  const optimalVessel = optResult?.evaluated_vessels?.find(v => v.vessel_class === optResult.optimal_vessel_class) || optResult?.evaluated_vessels?.[0];

  return (
    <div className="space-y-6">
      {/* Parameter Control Form */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Ship className="w-4 h-4 text-cyan-600" />
              <span>Vessel Optimization & Port Navigational Gatekeeper</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculates carrying deadweights, physical draft/LOA limits, and total landed costs per MT at Indian steel terminals.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 font-bold">
            Corridor Distance: {optResult?.route_distance_nm ?? 4850} NM
          </span>
        </div>

        {/* Input Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Commodity Type</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600">Parcel Size (MT)</label>
              <div className="flex space-x-1">
                {[45, 75, 150].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCargoQuantity(k * 1000)}
                    className="text-[10px] text-cyan-700 hover:text-cyan-900 font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 cursor-pointer"
                  >
                    {k}k
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              step="5000"
              min="15000"
              max="250000"
              value={cargoQuantity}
              onChange={(e) => setCargoQuantity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Loading Country</label>
            <select
              value={originCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {ORIGINS.map((o) => (
                <option key={o.country} value={o.country}>{o.country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Loading Port</label>
            <select
              value={originPort}
              onChange={(e) => setOriginPort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {(ORIGINS.find((o) => o.country === originCountry)?.ports || []).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Destination Port</label>
            <select
              value={destPort}
              onChange={(e) => setDestPort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all cursor-pointer"
            >
              {DEST_PORTS.map((dp) => (
                <option key={dp} value={dp}>{dp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hydrodynamic Draft & Seabed Cross-Section Visualizer */}
      <VesselDraftVisualizer
        vesselClass={optResult?.optimal_vessel_class || 'Capesize'}
        portName={destPort}
      />

      {/* Recommended Fixture Banner */}
      {optResult && (
        <div className="bg-gradient-to-r from-[#091a33] via-[#0d2a52] to-[#07172e] text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl border border-cyan-800/40 relative overflow-hidden">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Optimal Charter Selection Identified</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Recommended Class: <span className="text-cyan-300 underline underline-offset-4 decoration-cyan-400">{optResult.optimal_vessel_class || 'Capesize'}</span> Bulker
            </h3>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              {optResult.optimization_summary}
            </p>
          </div>

          <div className="shrink-0 bg-[#061224]/80 p-4 rounded-xl border border-cyan-700/50 text-right font-mono space-y-0.5">
            <span className="text-[11px] text-cyan-300 block font-sans uppercase font-bold">Total Landed Expenditure:</span>
            <span className="text-2xl font-extrabold text-white block">
              ${optimalVessel ? (optimalVessel.total_landed_cost_usd || 0).toLocaleString() : '0'}
            </span>
            <span className="text-xs text-emerald-400 font-bold block">
              ${optimalVessel ? (optimalVessel.landed_cost_per_mt_usd || 0).toFixed(2) : '0.00'} / MT
            </span>
          </div>
        </div>
      )}

      {/* 4 Vessel Class Detailed Comparison Grid */}
      {optResult && optResult.evaluated_vessels && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {optResult.evaluated_vessels.map((v) => {
            const isOptimal = v.vessel_class === optResult.optimal_vessel_class;
            const isRejected = !v.is_compatible;
            const capacityDwt = VESSEL_DWT_MAP[v.vessel_class] || 75000;
            const freightRate = v.ocean_freight_rate_usd_per_mt ?? 0;
            const bunkerRate = cargoQuantity > 0 ? (v.bunker_cost_usd / cargoQuantity) : 0;
            const portRate = cargoQuantity > 0 ? (v.port_charges_usd / cargoQuantity) : 0;
            const lighterageRate = cargoQuantity > 0 ? (v.lighterage_cost_usd / cargoQuantity) : 0;
            const demurrageRate = cargoQuantity > 0 ? (v.estimated_demurrage_usd / cargoQuantity) : 0;
            const landedRate = v.landed_cost_per_mt_usd ?? 0;
            const totalCost = v.total_landed_cost_usd ?? 0;
            const notes = (v.rejection_reasons || []).join(', ');

            return (
              <div
                key={v.vessel_class}
                className={`fi-card p-5 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isOptimal
                    ? 'border-2 border-cyan-500 shadow-lg shadow-cyan-950/10'
                    : isRejected
                    ? 'border-rose-300/80 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                {isOptimal && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    OPTIMAL SELECTION
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Ship className={`w-5 h-5 ${isOptimal ? 'text-cyan-600' : isRejected ? 'text-red-500' : 'text-slate-600'}`} />
                    <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{v.vessel_class}</h4>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Capacity: <strong className="text-slate-800">{capacityDwt.toLocaleString()} DWT</strong>
                  </div>

                  {/* Status Tag */}
                  <div>
                    {v.is_compatible ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Port Compatible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Restriction Violated</span>
                      </span>
                    )}
                  </div>

                  {/* Port Gatekeeper Rejection Reason */}
                  {notes && !v.is_compatible && (
                    <div className="bg-red-50 p-2.5 rounded-xl border border-red-200/80 text-[11px] text-red-800 leading-tight">
                      <strong>Rejection Reason:</strong> {notes}
                    </div>
                  )}

                  {/* Landed Cost Breakdown */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Ocean Freight:</span>
                      <strong className="text-slate-900">${freightRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Fuel / BAF:</span>
                      <strong className="text-slate-900">${bunkerRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Port Dues:</span>
                      <strong className="text-slate-900">${portRate.toFixed(2)}/MT</strong>
                    </div>
                    {lighterageRate > 0 && (
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Lighterage (Sagar):</span>
                        <strong>+${lighterageRate.toFixed(2)}/MT</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Demurrage Risk:</span>
                      <strong className="text-slate-900">${demurrageRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                      <span className="font-sans">Total Landed:</span>
                      <span className={isOptimal ? 'text-cyan-700' : 'text-slate-900'}>
                        ${landedRate.toFixed(2)} / MT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Expenditure */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Voyage Total:</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
