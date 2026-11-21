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
  Legend
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
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-cyan-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Machine Learning Model Benchmark & Cross-Validation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Out-of-sample statistical evaluation comparing Ridge Regression, Random Forest, and XGBoost with TimeSeriesSplit.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 font-bold">Vessel Category:</span>
            <select
              value={vesselClass}
              onChange={(e) => setVesselClass(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
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
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">R² Score (Holdout)</th>
                <th className="py-2.5 px-3">MAE ($/MT)</th>
                <th className="py-2.5 px-3">RMSE ($/MT)</th>
                <th className="py-2.5 px-3">MAPE (%)</th>
                <th className="py-2.5 px-3">Production Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m, idx) => {
                const isBest = m.is_best_model;
                const r2 = m.r2_score ?? 0;
                const mae = m.mae ?? 0;
                const rmse = m.rmse ?? 0;
                const mape = m.mape ?? m.mape_percent ?? 0;

                return (
                  <tr key={idx} className={isBest ? 'bg-cyan-50/50 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center space-x-1.5">
                      {isBest && <Award className="w-3.5 h-3.5 text-cyan-600" />}
                      <span>{m.model_name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-extrabold text-cyan-700">
                      {r2.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">${mae.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">${rmse.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{mape.toFixed(2)}%</td>
                    <td className="py-2.5 px-3">
                      {isBest ? (
                        <span className="bg-cyan-100 text-cyan-800 border border-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
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
        <div className="fi-card p-5 space-y-3 border-t-4 border-t-cyan-500">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Coefficient of Determination (R² Score Benchmark)
          </h3>
          <p className="text-[11px] text-slate-500">Higher indicates greater proportion of variance explained</p>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="model_name" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0.7, 1.0]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="r2_score" fill="#0891b2" name="R² Score" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="fi-card p-5 space-y-3 border-t-4 border-t-blue-600">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Mean Absolute Error (MAE in $/MT)
          </h3>
          <p className="text-[11px] text-slate-500">Lower indicates tighter freight rate prediction accuracy</p>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="model_name" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="mae" fill="#2563eb" name="MAE ($/MT)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
