import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Ship,
  Anchor,
  Clock,
  ArrowRight,
  Compass,
  AlertTriangle,
  Layers,
  Train,
  CheckCircle2,
  DollarSign,
  Fuel,
  Sparkles,
  Navigation
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { fetchForecast } from '../services/api';
import MaritimeRouteMap from '../components/MaritimeRouteMap';

export default function OverviewView({ setActivePage }) {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHorizon, setSelectedHorizon] = useState(30);
  const [selectedPort, setSelectedPort] = useState('Paradip');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchForecast('Capesize', 'AUS_HAY_PARADIP', selectedHorizon);
        setForecastData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedHorizon]);

  return (
    <div className="space-y-6">
      {/* Visual Operational Hero Header in Jade Emerald & Amber */}
      <div className="bg-gradient-to-r from-[#07130c] via-[#0d2116] to-[#0a1810] border border-emerald-800/40 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ministry of Steel (SAIL)</span>
              <span className="text-amber-400">•</span>
              <span>Raw Material Procurement Central Command</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Maritime Freight & Chartering Decision Support Platform
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Predictive rate modeling, port navigational constraints gatekeeping, and demurrage risk management for overseas coking coal shipments to Indian East Coast blast furnaces.
            </p>

            {/* Quick Corridor Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-semibold bg-[#0a1610] text-emerald-200 px-3 py-1 rounded-lg border border-emerald-800/50">
                Hay Point → Paradip (4,850 NM)
              </span>
              <span className="text-[11px] font-semibold bg-[#0a1610] text-emerald-200 px-3 py-1 rounded-lg border border-emerald-800/50">
                Gladstone → Dhamra (4,890 NM)
              </span>
              <span className="text-[11px] font-semibold bg-[#0a1610] text-amber-200 px-3 py-1 rounded-lg border border-amber-800/50">
                Hampton Roads → Vizag (11,300 NM)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActivePage('vessel_opt')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-950/60 cursor-pointer border border-emerald-400/40"
            >
              <Ship className="w-4 h-4" />
              <span>Optimize Vessel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage('simulator')}
              className="px-4 py-2.5 bg-[#0e1d15] hover:bg-[#142b1f] text-slate-200 border border-[#1b3d28] text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              What-If Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Maritime Corridor Radar & Geospatial Route Visualizer */}
      <MaritimeRouteMap selectedPort={selectedPort} onSelectPort={(port) => setSelectedPort(port)} />

      {/* KPI Cards Row with Top Accent Borders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Capesize Spot Rate */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capesize Spot Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-white font-mono">
              ${forecastData ? (forecastData.current_spot_rate_usd || 18.40).toFixed(2) : '18.40'}
            </span>
            <span className="text-xs font-medium text-slate-400">/ MT</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 pt-1 border-t border-[#193324]">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>30d Soften: {forecastData ? Math.abs(forecastData.percentage_change_projected || 4.2).toFixed(1) : 4.2}%</span>
          </div>
        </div>

        {/* KPI 2: Panamax Spot Rate */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Panamax Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-amber-300 font-mono">$21.20</span>
            <span className="text-xs font-medium text-slate-400">/ MT</span>
          </div>
          <div className="text-xs text-slate-400 font-medium flex items-center space-x-1 pt-1 border-t border-[#193324]">
            <span>Australia → Paradip Corridor</span>
          </div>
        </div>

        {/* KPI 3: East Coast Waiting Time */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">East Coast Avg Wait</span>
            <div className="w-8 h-8 rounded-xl bg-teal-950/70 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-teal-300 font-mono">2.8</span>
            <span className="text-xs font-medium text-slate-400">days</span>
          </div>
          <div className="text-xs text-amber-400 font-semibold flex items-center space-x-1 pt-1 border-t border-[#193324]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Haldia / Paradip queue congested</span>
          </div>
        </div>

        {/* KPI 4: VLSFO Bunker Benchmark */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-yellow-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Singapore VLSFO</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-950/70 border border-yellow-800/60 flex items-center justify-center text-yellow-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-yellow-300 font-mono">$635.00</span>
            <span className="text-xs font-medium text-slate-400">/ MT</span>
          </div>
          <div className="text-xs text-slate-400 font-medium flex items-center space-x-1 pt-1 border-t border-[#193324]">
            <span>BAF Stability: Sideways Trend</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Chart & Charter Strategy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 30-Day Forward Rate Forecast */}
        <div className="lg:col-span-2 fi-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#193324] pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Freight Rate Forecasting Trajectory
                </h3>
                <span className="text-[10px] bg-emerald-950/70 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                  XGBoost + Residual Bounds
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Capesize bulk carrier (175,000 DWT) • Australia (Hay Point) → India East Coast
              </p>
            </div>

            {/* Segmented Horizon Switcher */}
            <div className="bg-[#0a1410] p-1 rounded-xl flex items-center space-x-1 border border-[#193324] self-start sm:self-auto">
              {[7, 14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedHorizon(d)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedHorizon === d
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                Running XGBoost forecast inference...
              </div>
            ) : forecastData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData.forecast_points}>
                  <defs>
                    <linearGradient id="colorForecastEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#142b1e" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1813',
                      borderColor: '#10b981',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '11px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#94a3b8' }} />
                  <Area
                    type="monotone"
                    dataKey="upper_80"
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    fill="none"
                    name="Upper Bound (80%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_rate_usd"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#colorForecastEmerald)"
                    name="Predicted Spot ($/MT)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower_80"
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    fill="none"
                    name="Lower Bound (80%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#193324]">
            <span>Current Fixed Rate: <strong className="text-white font-mono">$18.40 / MT</strong></span>
            <span>Forecast Horizon: <strong className="text-emerald-400 font-mono">{selectedHorizon} Days Forward</strong></span>
            <span>Confidence Interval: <strong className="text-amber-400 font-mono">80% Gaussian Kernel</strong></span>
          </div>
        </div>

        {/* Right 1 Col: Smart Charter Recommendation Summary Card */}
        <div className="fi-card p-5 space-y-4 border-t-4 border-t-amber-500 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Charter Arbitrage Signal</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60">
                RECOMMENDATION: DEFER SPOT
              </span>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-amber-300">
                Action: Defer Booking 14–21 Days
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Freight rates on the Australia–India corridor are projected to decline by <strong>$0.77/MT</strong> due to Chinese restocking slowdown and fleet supply rebound in the Pacific basin.
              </p>
            </div>

            {/* Financial Delta Metrics */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#193324]">
                <span className="text-slate-400">Immediate Spot Cost (150k MT):</span>
                <span className="font-mono font-bold text-white">$2,760,000</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#193324]">
                <span className="text-slate-400">Projected Deferred Cost (T+21d):</span>
                <span className="font-mono font-bold text-white">$2,644,500</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-emerald-300 font-bold bg-emerald-950/60 px-2.5 rounded-lg border border-emerald-800/50">
                <span>Estimated Net Savings for SAIL:</span>
                <span className="font-mono text-sm">+$115,500</span>
              </div>
            </div>

            {/* Vessel Recommendation Snippet */}
            <div className="bg-[#0a1410] p-3 rounded-xl border border-[#193324] space-y-1 text-xs">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <Ship className="w-3.5 h-3.5 text-emerald-400" />
                <span>Optimal Vessel: Capesize (150k MT)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Landed cost of $21.45/MT via Dhamra vs $25.80/MT via Panamax at Paradip. Saves $652,500 in ocean freight economies of scale.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('charter')}
            className="w-full mt-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/50 border border-emerald-400/30"
          >
            <span>View Full Charter Strategy Memo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* East Coast Port Infrastructure & Gatekeeper Summary Table */}
      <div className="fi-card p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-emerald-400" />
              <span>Indian East Coast Terminals & Navigational Constraints</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live physical draft ceilings, LOA limits, mechanized discharge throughput, and railway connectivity to SAIL steel plants.
            </p>
          </div>
          <button
            onClick={() => setActivePage('ports')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Port Intelligence Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#0a1410] text-slate-400 font-bold border-b border-[#193324]">
                <th className="py-2.5 px-3">Port & Terminal</th>
                <th className="py-2.5 px-3">Max Draft</th>
                <th className="py-2.5 px-3">Max LOA</th>
                <th className="py-2.5 px-3">Capesize Status</th>
                <th className="py-2.5 px-3">Discharge Rate</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">SAIL Plant Rake Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#193324]">
              {[
                { port: 'Paradip (CQ1/CQ2)', draft: '14.5m', loa: '260m', cape: 'Restricted (14.5m)', rate: '35,000 MT/d', wait: '4.2 d', rake: 'Rourkela (RSP) • Bokaro (BSL)' },
                { port: 'Dhamra (Berth 1/2)', draft: '18.5m', loa: '310m', cape: 'Direct Berthing', rate: '50,000 MT/d', wait: '2.1 d', rake: 'Rourkela (RSP) • Bokaro (BSL)' },
                { port: 'Visakhapatnam (OB-I)', draft: '16.5m', loa: '280m', cape: 'Restricted (Draft)', rate: '30,000 MT/d', wait: '2.9 d', rake: 'Bhilai Steel Plant (BSP)' },
                { port: 'Gangavaram (Coal Berth)', draft: '19.0m', loa: '320m', cape: 'Direct Berthing', rate: '55,000 MT/d', wait: '1.5 d', rake: 'Bhilai Steel Plant (BSP)' },
                { port: 'Gopalpur', draft: '12.5m', loa: '225m', cape: 'Incompatible (Panamax only)', rate: '20,000 MT/d', wait: '1.8 d', rake: 'Rourkela (RSP)' },
                { port: 'Haldia Dock Complex', draft: '8.5m', loa: '190m', cape: 'Blocked (Riverine Sandbar)', rate: '15,000 MT/d', wait: '4.8 d', rake: 'Durgapur (DSP) • IISCO (ISP)' },
                { port: 'Sagar / Sandheads', draft: '20.0m', loa: '330m', cape: 'Anchorage Lighterage', rate: '25,000 MT/d', wait: '1.2 d', rake: 'Barge transfer to Haldia' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#12241b]/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{row.port}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                    <div className="flex items-center space-x-1.5">
                      <span>{row.draft}</span>
                      <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            parseFloat(row.draft) >= 18 ? 'bg-emerald-400' : parseFloat(row.draft) >= 14 ? 'bg-teal-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${(parseFloat(row.draft) / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{row.loa}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.cape.includes('Direct')
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : row.cape.includes('Restricted') || row.cape.includes('Anchorage')
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {row.cape}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{row.rate}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-white">
                    <span className={parseFloat(row.wait) > 3.5 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {row.wait}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 flex items-center space-x-1">
                    <Train className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{row.rake}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
