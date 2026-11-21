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
      {/* Visual Operational Hero Header */}
      <div className="bg-gradient-to-r from-[#071426] via-[#0d223f] to-[#0a1b33] border border-blue-900/60 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Ministry of Steel (SAIL)</span>
              <span className="text-blue-500">•</span>
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
              <span className="text-[11px] font-semibold bg-blue-950/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                Hay Point → Paradip (4,850 NM)
              </span>
              <span className="text-[11px] font-semibold bg-blue-950/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                Gladstone → Dhamra (4,890 NM)
              </span>
              <span className="text-[11px] font-semibold bg-blue-950/80 text-cyan-200 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                Hampton Roads → Vizag (11,300 NM)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActivePage('vessel_opt')}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <Ship className="w-4 h-4" />
              <span>Optimize Vessel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage('simulator')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
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
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Capesize Spot Rate</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              ${forecastData ? forecastData.current_spot_rate_usd.toFixed(2) : '18.40'}
            </span>
            <span className="text-xs font-medium text-slate-500">/ MT</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-1 pt-1 border-t border-slate-100">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>30d Projected Soften: {forecastData ? Math.abs(forecastData.percentage_change_projected) : 4.2}%</span>
          </div>
        </div>

        {/* KPI 2: Panamax Spot Rate */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Panamax Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">$21.20</span>
            <span className="text-xs font-medium text-slate-500">/ MT</span>
          </div>
          <div className="text-xs text-slate-600 font-medium flex items-center space-x-1 pt-1 border-t border-slate-100">
            <span>Australia → Paradip Corridor</span>
          </div>
        </div>

        {/* KPI 3: East Coast Waiting Time */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">East Coast Avg Wait</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">2.8</span>
            <span className="text-xs font-medium text-slate-500">days</span>
          </div>
          <div className="text-xs text-amber-700 font-semibold flex items-center space-x-1 pt-1 border-t border-slate-100">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Haldia / Paradip queue congested</span>
          </div>
        </div>

        {/* KPI 4: VLSFO Bunker Benchmark */}
        <div className="fi-card p-4 space-y-2 border-t-4 border-t-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Singapore VLSFO</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">$635.00</span>
            <span className="text-xs font-medium text-slate-500">/ MT</span>
          </div>
          <div className="text-xs text-slate-600 font-medium flex items-center space-x-1 pt-1 border-t border-slate-100">
            <span>BAF Stability: Sideways Trend</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Chart & Charter Strategy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: 30-Day Forward Rate Forecast */}
        <div className="lg:col-span-2 fi-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Freight Rate Forecasting Trajectory
                </h3>
                <span className="text-[10px] bg-cyan-50 text-cyan-800 font-bold px-2 py-0.5 rounded border border-cyan-200">
                  XGBoost + Residual Bounds
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Capesize bulk carrier (175,000 DWT) • Australia (Hay Point) → India East Coast
              </p>
            </div>

            {/* Segmented Horizon Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 self-start sm:self-auto">
              {[7, 14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedHorizon(d)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedHorizon === d
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Updating forecast simulation...
              </div>
            ) : forecastData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData.forecast_points}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
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
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="upper_80"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    fill="none"
                    name="Upper Bound (80%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_rate_usd"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fill="url(#colorForecast)"
                    name="Predicted Spot ($/MT)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower_80"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    fill="none"
                    name="Lower Bound (80%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Current Fixed Rate: <strong className="text-slate-800">$18.40 / MT</strong></span>
            <span>Forecast Horizon: <strong className="text-blue-700">{selectedHorizon} Days Forward</strong></span>
            <span>Confidence Interval: <strong className="text-emerald-700">80% Gaussian Kernel</strong></span>
          </div>
        </div>

        {/* Right 1 Col: Smart Charter Recommendation Summary Card */}
        <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Charter Arbitrage Signal</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                RECOMMENDATION: DEFER SPOT
              </span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-emerald-950">
                Action: Defer Booking 14–21 Days
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                Freight rates on the Australia–India corridor are projected to decline by <strong>$0.77/MT</strong> due to Chinese restocking slowdown and fleet supply rebound in the Pacific basin.
              </p>
            </div>

            {/* Financial Delta Metrics */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Immediate Spot Cost (150,000 MT):</span>
                <span className="font-mono font-bold text-slate-900">$2,760,000</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Projected Deferred Cost (T+21d):</span>
                <span className="font-mono font-bold text-slate-900">$2,644,500</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 rounded-lg">
                <span>Estimated Net Savings for SAIL:</span>
                <span className="font-mono text-sm">+$115,500</span>
              </div>
            </div>

            {/* Vessel Recommendation Snippet */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Ship className="w-3.5 h-3.5 text-blue-600" />
                <span>Optimal Vessel: Capesize (150k MT)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Landed cost of $21.45/MT via Dhamra vs $25.80/MT via Panamax at Paradip. Saves $652,500 in ocean freight economies of scale.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('charter')}
            className="w-full mt-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
          >
            <span>View Full Charter Strategy Memo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* East Coast Port Infrastructure & Gatekeeper Summary Table */}
      <div className="fi-card p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-cyan-600" />
              <span>Indian East Coast Terminals & Navigational Constraints</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live physical draft ceilings, LOA limits, mechanized discharge throughput, and railway connectivity to SAIL steel plants.
            </p>
          </div>
          <button
            onClick={() => setActivePage('ports')}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Port Intelligence Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Port & Terminal</th>
                <th className="py-2.5 px-3">Max Draft</th>
                <th className="py-2.5 px-3">Max LOA</th>
                <th className="py-2.5 px-3">Capesize Status</th>
                <th className="py-2.5 px-3">Discharge Rate</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">SAIL Plant Rake Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { port: 'Paradip (CQ1/CQ2)', draft: '14.5m', loa: '260m', cape: 'Restricted (14.5m)', rate: '35,000 MT/d', wait: '4.2 d', rake: 'Rourkela (RSP) • Bokaro (BSL)' },
                { port: 'Dhamra (Berth 1/2)', draft: '18.5m', loa: '310m', cape: 'Direct Berthing', rate: '50,000 MT/d', wait: '2.1 d', rake: 'Rourkela (RSP) • Bokaro (BSL)' },
                { port: 'Visakhapatnam (OB-I)', draft: '16.5m', loa: '280m', cape: 'Restricted (Draft)', rate: '30,000 MT/d', wait: '2.9 d', rake: 'Bhilai Steel Plant (BSP)' },
                { port: 'Gangavaram (Coal Berth)', draft: '19.0m', loa: '320m', cape: 'Direct Berthing', rate: '55,000 MT/d', wait: '1.5 d', rake: 'Bhilai Steel Plant (BSP)' },
                { port: 'Gopalpur', draft: '12.5m', loa: '225m', cape: 'Incompatible (Panamax only)', rate: '20,000 MT/d', wait: '1.8 d', rake: 'Rourkela (RSP)' },
                { port: 'Haldia Dock Complex', draft: '8.5m', loa: '190m', cape: 'Blocked (Riverine Sandbar)', rate: '15,000 MT/d', wait: '4.8 d', rake: 'Durgapur (DSP) • IISCO (ISP)' },
                { port: 'Sagar / Sandheads', draft: '20.0m', loa: '330m', cape: 'Anchorage Lighterage', rate: '25,000 MT/d', wait: '1.2 d', rake: 'Barge transfer to Haldia' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                    <span>{row.port}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <span>{row.draft}</span>
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            parseFloat(row.draft) >= 18 ? 'bg-emerald-500' : parseFloat(row.draft) >= 14 ? 'bg-cyan-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(parseFloat(row.draft) / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{row.loa}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.cape.includes('Direct')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.cape.includes('Restricted') || row.cape.includes('Anchorage')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {row.cape}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{row.rate}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    <span className={parseFloat(row.wait) > 3.5 ? 'text-amber-700 font-bold' : 'text-slate-700'}>
                      {row.wait}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 flex items-center space-x-1">
                    <Train className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
