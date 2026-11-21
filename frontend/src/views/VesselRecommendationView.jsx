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
  Waves,
  Gauge,
  Sliders,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { optimizeVessel, fetchEcoSteamingCurves } from '../services/api';
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
  const [ecoData, setEcoData] = useState(null);
  const [selectedSpeed, setSelectedSpeed] = useState(12.0);
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

      const targetClass = data?.optimal_vessel_class || 'Capesize';
      const eco = await fetchEcoSteamingCurves(targetClass, data?.route_distance_nm || 4850).catch(() => null);
      if (eco) {
        setEcoData(eco);
        setSelectedSpeed(eco.optimal_eco_speed_knots || 11.5);
      }
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
  const activeSpeedCurve = ecoData?.speed_curves?.find(c => Math.abs(c.speed_knots - selectedSpeed) < 0.25) || ecoData?.speed_curves?.[2];

  return (
    <div className="space-y-6">
      {/* Parameter Control Form */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Ship className="w-4 h-4 text-emerald-400" />
              <span>Vessel Optimization & Port Navigational Gatekeeper</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculates carrying deadweights, physical draft/LOA limits, and total landed costs per MT at Indian steel terminals.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-800/60 font-bold">
            Corridor Distance: {optResult?.route_distance_nm ?? 4850} NM
          </span>
        </div>

        {/* Input Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Commodity Type</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-emerald-400 cursor-pointer"
            >
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300">Parcel Size (MT)</label>
              <div className="flex space-x-1">
                {[45, 75, 150].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCargoQuantity(k * 1000)}
                    className="text-[10px] text-amber-300 hover:text-amber-200 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 cursor-pointer"
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
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Loading Country</label>
            <select
              value={originCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-emerald-400 cursor-pointer"
            >
              {ORIGINS.map((o) => (
                <option key={o.country} value={o.country}>{o.country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Loading Port</label>
            <select
              value={originPort}
              onChange={(e) => setOriginPort(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-emerald-400 cursor-pointer"
            >
              {(ORIGINS.find((o) => o.country === originCountry)?.ports || []).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Destination Port</label>
            <select
              value={destPort}
              onChange={(e) => setDestPort(e.target.value)}
              className="w-full bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-emerald-400 cursor-pointer"
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

      {/* Recommended Fixture Banner in Jade Emerald & Gold */}
      {optResult && (
        <div className="bg-gradient-to-r from-[#07140e] via-[#0c2217] to-[#060e0a] text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl border border-emerald-800/60 relative overflow-hidden">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Optimal Charter Selection Identified</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Recommended Class: <span className="text-amber-300 underline underline-offset-4 decoration-amber-400">{optResult.optimal_vessel_class || 'Capesize'}</span> Bulker
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {optResult.optimization_summary}
            </p>
          </div>

          <div className="shrink-0 bg-[#060d09]/90 p-4 rounded-xl border border-emerald-700/60 text-right font-mono space-y-0.5">
            <span className="text-[11px] text-emerald-300 block font-sans uppercase font-bold">Total Landed Expenditure:</span>
            <span className="text-2xl font-extrabold text-white block">
              ${optimalVessel ? (optimalVessel.total_landed_cost_usd || 0).toLocaleString() : '0'}
            </span>
            <span className="text-xs text-amber-300 font-bold block">
              ${optimalVessel ? (optimalVessel.landed_cost_per_mt_usd || 0).toFixed(2) : '0.00'} / MT
            </span>
          </div>
        </div>
      )}

      {/* Hydrodynamic Admiralty Eco-Steaming Law Engine */}
      {ecoData && (
        <div className="fi-card p-5 space-y-4 border-t-4 border-t-amber-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#193324] pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Admiralty Propeller Law: Eco-Steaming Optimization (F ∝ S³)
                </h3>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  Cubic Power Optimization
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust cruising speed to minimize fuel consumption against daily time-charter rates. Optimal eco-speed is <strong className="text-emerald-300">{ecoData.optimal_eco_speed_knots} knots</strong>.
              </p>
            </div>
            <div className="text-right font-mono shrink-0">
              <span className="text-slate-400 text-[10px] block font-sans">Max Fuel Savings:</span>
              <span className="text-base font-extrabold text-emerald-400">
                +${(ecoData.potential_fuel_savings_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
              </span>
              <span className="text-[10px] text-amber-300 block font-bold">CO₂ -{ecoData.co2_reduction_percentage}%</span>
            </div>
          </div>

          {/* Interactive Steaming Speed Slider & Readout */}
          <div className="bg-[#0a1410] p-4 rounded-xl border border-[#193324] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span>Cruising Steaming Speed: <strong className="text-emerald-300 font-mono text-sm">{selectedSpeed} knots</strong></span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedSpeed <= 11.5 ? '⚡ Eco-Steaming Mode (Maximum Fuel & Carbon Savings)' : selectedSpeed >= 14.0 ? '⚠️ High-Speed Full Laden (Design Speed, High Fuel Burn)' : 'Cruising Standard Speed'}
                </span>
              </div>

              {activeSpeedCurve && (
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
                    <span className="text-slate-400 text-[10px] block font-sans">Transit Days:</span>
                    <strong className="text-white">{activeSpeedCurve.steaming_days} days</strong>
                  </div>
                  <div className="bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
                    <span className="text-slate-400 text-[10px] block font-sans">Bunker Fuel:</span>
                    <strong className="text-amber-300">${(activeSpeedCurve.bunker_cost_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                  </div>
                  <div className="bg-[#0d1813] px-3 py-1.5 rounded-lg border border-[#193324]">
                    <span className="text-slate-400 text-[10px] block font-sans">Landed / MT:</span>
                    <strong className="text-emerald-400">${activeSpeedCurve.cost_per_mt_usd?.toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>

            <input
              type="range"
              min="10.5"
              max="15.0"
              step="0.5"
              value={selectedSpeed}
              onChange={(e) => setSelectedSpeed(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>10.5 knots (Super Eco)</span>
              <span className="text-emerald-400 font-bold">11.5 knots (Optimal Minimum Cost)</span>
              <span>14.5 knots (Design Service Speed)</span>
            </div>
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
                    ? 'border-2 border-emerald-400 shadow-xl shadow-emerald-950/40 bg-[#0d2217]'
                    : isRejected
                    ? 'border-rose-900/60 bg-[#140d10]'
                    : 'border-[#193324]'
                }`}
              >
                {isOptimal && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm border-b border-l border-emerald-300/40">
                    OPTIMAL SELECTION
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Ship className={`w-5 h-5 ${isOptimal ? 'text-emerald-400' : isRejected ? 'text-rose-400' : 'text-slate-400'}`} />
                    <h4 className="text-base font-extrabold text-white tracking-tight">{v.vessel_class}</h4>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Capacity: <strong className="text-white font-mono">{capacityDwt.toLocaleString()} DWT</strong>
                  </div>

                  {/* Status Tag */}
                  <div>
                    {v.is_compatible ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Port Compatible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/70 text-rose-300 border border-rose-800/60">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Restriction Violated</span>
                      </span>
                    )}
                  </div>

                  {/* Port Gatekeeper Rejection Reason */}
                  {notes && !v.is_compatible && (
                    <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 text-[11px] text-rose-200 leading-tight">
                      <strong>Rejection Reason:</strong> {notes}
                    </div>
                  )}

                  {/* Landed Cost Breakdown */}
                  <div className="bg-[#0a1410] p-3 rounded-xl border border-[#193324] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Ocean Freight:</span>
                      <strong className="text-white">${freightRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Fuel / BAF:</span>
                      <strong className="text-white">${bunkerRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Port Dues:</span>
                      <strong className="text-white">${portRate.toFixed(2)}/MT</strong>
                    </div>
                    {lighterageRate > 0 && (
                      <div className="flex justify-between text-amber-300 font-bold">
                        <span>Lighterage (Sagar):</span>
                        <strong>+${lighterageRate.toFixed(2)}/MT</strong>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-300">
                      <span>Demurrage Risk:</span>
                      <strong className="text-white">${demurrageRate.toFixed(2)}/MT</strong>
                    </div>
                    <div className="pt-2 border-t border-[#193324] flex justify-between font-bold text-white text-sm">
                      <span className="font-sans">Total Landed:</span>
                      <span className={isOptimal ? 'text-amber-300' : 'text-white'}>
                        ${landedRate.toFixed(2)} / MT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Expenditure */}
                <div className="pt-2 border-t border-[#193324] flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Voyage Total:</span>
                  <span className="font-mono font-extrabold text-white">
                    ${(totalCost || 0).toLocaleString()}
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
