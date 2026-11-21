import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  RefreshCw,
  BarChart2,
  CheckCircle2,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { fetchModelPerformance } from '../services/api';

export default function ModelPerformanceView() {
  const [vesselClass, setVesselClass] = useState('Capesize');
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchModelPerformance(vesselClass);
      setMetrics(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [vesselClass]);

  return (
    <div className="space-y-6">
      {/* Header Context Bar */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Machine Learning Model Benchmark & Cross-Validation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Out-of-sample statistical evaluation comparing Ridge Regression, Random Forest, and XGBoost with TimeSeriesSplit.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">Vessel Category:</span>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="bg-[#0a1410] border border-[#193324] rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-emerald-400 cursor-pointer"
            >
              {['Capesize', 'Panamax', 'Supramax', 'Handysize'].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Algorithm Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#0a1410] text-slate-400 font-bold border-b border-[#193324]">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">R² Score (Holdout)</th>
                <th className="py-2.5 px-3">MAE ($/MT)</th>
                <th className="py-2.5 px-3">RMSE ($/MT)</th>
                <th className="py-2.5 px-3">MAPE (%)</th>
                <th className="py-2.5 px-3">Production Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#193324]">
              {metrics.map((m, idx) => {
                const isBest = m.is_best_model;
                const r2 = m.r2_score ?? 0;
                const mae = m.mae ?? 0;
                const rmse = m.rmse ?? 0;
                const mape = m.mape ?? m.mape_percent ?? 0;

                return (
                  <tr key={idx} className={isBest ? 'bg-[#0f281b] font-semibold text-white' : 'hover:bg-[#0a1410] text-slate-300'}>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center space-x-1.5">
                      {isBest && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{m.model_name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-extrabold text-emerald-300">
                      {r2.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">${mae.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">${rmse.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">{mape.toFixed(2)}%</td>
                    <td className="py-2.5 px-3">
                      {isBest ? (
                        <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          DEPLOYED ACTIVE
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Benchmark Candidate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Comparison BarChart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="fi-card p-5 space-y-3 border-t-4 border-t-emerald-500">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Coefficient of Determination (R² Score Benchmark)
          </h3>
          <p className="text-[11px] text-slate-400">Higher indicates greater proportion of variance explained</p>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162e20" />
                <XAxis dataKey="model_name" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0.7, 1.0]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1813',
                    borderColor: '#10b981',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar dataKey="r2_score" fill="#10b981" name="R² Score" radius={[6, 6, 0, 0]}>
                  {metrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.is_best_model ? '#10b981' : '#234431'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fi-card p-5 space-y-3 border-t-4 border-t-amber-500">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Mean Absolute Error (MAE in $/MT)
          </h3>
          <p className="text-[11px] text-slate-400">Lower indicates tighter freight rate prediction accuracy</p>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162e20" />
                <XAxis dataKey="model_name" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1813',
                    borderColor: '#f59e0b',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar dataKey="mae" fill="#f59e0b" name="MAE ($/MT)" radius={[6, 6, 0, 0]}>
                  {metrics.map((entry, index) => (
                    <Cell key={`cell-mae-${index}`} fill={entry.is_best_model ? '#fbbf24' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
