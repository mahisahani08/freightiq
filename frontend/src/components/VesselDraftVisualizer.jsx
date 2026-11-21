import React from 'react';
import { Ship, AlertTriangle, CheckCircle2, Waves, ArrowDown, ShieldAlert, Anchor } from 'lucide-react';

const VESSEL_SPECS = {
  Capesize: { dwt: '180,000 MT', loa: '292m', beam: '45.0m', draft: 18.2, holds: 9, dailyCharter: '$28,500' },
  Panamax: { dwt: '75,000 MT', loa: '225m', beam: '32.2m', draft: 14.4, holds: 7, dailyCharter: '$16,200' },
  Supramax: { dwt: '58,000 MT', loa: '190m', beam: '32.2m', draft: 13.0, holds: 5, dailyCharter: '$13,800' },
  Handysize: { dwt: '35,000 MT', loa: '180m', beam: '28.0m', draft: 10.5, holds: 4, dailyCharter: '$11,400' }
};

const PORT_LIMITS = {
  Paradip: { maxDraft: 14.5, maxLoa: 260, lighterageNeeded: false, name: 'Paradip Port' },
  Dhamra: { maxDraft: 18.5, maxLoa: 310, lighterageNeeded: false, name: 'Dhamra Port (Adani)' },
  Visakhapatnam: { maxDraft: 16.5, maxLoa: 280, lighterageNeeded: false, name: 'Visakhapatnam Port' },
  Gangavaram: { maxDraft: 19.0, maxLoa: 320, lighterageNeeded: false, name: 'Gangavaram Deepwater' },
  Gopalpur: { maxDraft: 12.5, maxLoa: 225, lighterageNeeded: false, name: 'Gopalpur Port' },
  Haldia: { maxDraft: 8.5, maxLoa: 190, lighterageNeeded: true, name: 'Haldia Dock Complex (Riverine)' },
  'Sagar-Sandheads': { maxDraft: 20.0, maxLoa: 330, lighterageNeeded: false, name: 'Sagar Deepwater Anchorage' }
};

export default function VesselDraftVisualizer({
  vesselClass = 'Capesize',
  portName = 'Paradip'
}) {
  const spec = VESSEL_SPECS[vesselClass] || VESSEL_SPECS['Capesize'];
  const port = PORT_LIMITS[portName] || PORT_LIMITS['Paradip'];

  const draftDiff = spec.draft - port.maxDraft;
  const isDraftViolation = draftDiff > 0;
  const isHaldia = portName.toLowerCase().includes('haldia');

  // SVG dimensions for cross-section
  const waterSurfaceY = 50;
  const vesselDraftY = waterSurfaceY + spec.draft * 7.5;
  const seabedY = waterSurfaceY + port.maxDraft * 7.5;

  return (
    <div className="bg-[#0d1813] rounded-2xl p-5 border border-[#193324] shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            <Waves className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hydrodynamic Draft & Seabed Gatekeeper</span>
          </div>
          <h4 className="text-sm font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>{vesselClass} Bulker vs {port.name} Navigational Thresholds</span>
          </h4>
        </div>

        {/* Verdict Badge */}
        {isDraftViolation ? (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-rose-950/70 text-rose-300 rounded-full border border-rose-800/60 text-xs font-bold shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>DRAFT BREACH (+{draftDiff.toFixed(1)}m Excess)</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/70 text-emerald-300 rounded-full border border-emerald-800/60 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>HYDRODYNAMICAL FIT ({Math.abs(draftDiff).toFixed(1)}m UKC)</span>
          </div>
        )}
      </div>

      {/* Graphical Hull Cross-Section Visualizer in Emerald & Gold */}
      <div className="relative w-full h-52 bg-gradient-to-b from-[#08120c] via-[#0c1f15] to-[#10291c] rounded-xl border border-[#193324] overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 600 240" className="w-full h-full max-h-52">
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterGradJade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
            </linearGradient>

            <pattern id="seabedPatternJade" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 10 0 M 0 0 L 10 10" fill="none" stroke="#234230" strokeWidth="1" opacity="0.5" />
            </pattern>
          </defs>

          {/* Water Surface Line */}
          <rect x="0" y={waterSurfaceY} width="600" height="190" fill="url(#waterGradJade)" />
          <line x1="0" y1={waterSurfaceY} x2="600" y2={waterSurfaceY} stroke="#34d399" strokeWidth="2" strokeDasharray="6 3" />
          <text x="15" y={waterSurfaceY - 8} fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            Water Surface (0.0m Chart Datum)
          </text>

          {/* Seabed Depth Line */}
          <rect x="0" y={seabedY} width="600" height={240 - seabedY} fill="#09130d" />
          <rect x="0" y={seabedY} width="600" height={240 - seabedY} fill="url(#seabedPatternJade)" />
          <line
            x1="0"
            y1={seabedY}
            x2="600"
            y2={seabedY}
            stroke={isDraftViolation ? '#f43f5e' : '#f59e0b'}
            strokeWidth="2.5"
          />
          <text
            x="440"
            y={seabedY + 14}
            fill={isDraftViolation ? '#f43f5e' : '#fbbf24'}
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Seabed: {port.maxDraft}m ({portName})
          </text>

          {/* Vessel Silhouette */}
          <g transform="translate(180, 20)">
            {/* Ship Superstructure & Bridge */}
            <rect x="30" y="8" width="30" height="22" fill="#14261c" rx="2" stroke="#34d399" strokeWidth="1" />
            <rect x="38" y="2" width="14" height="6" fill="#2d4f3b" />
            <line x1="45" y1="2" x2="45" y2="-6" stroke="#f59e0b" strokeWidth="2" />

            {/* Ship Cargo Hull Profile */}
            <path
              d={`M 10 30 L 220 30 L 210 ${waterSurfaceY + spec.draft * 7.5 - 20} Q 190 ${waterSurfaceY + spec.draft * 7.5} 120 ${waterSurfaceY + spec.draft * 7.5} Q 40 ${waterSurfaceY + spec.draft * 7.5} 20 ${waterSurfaceY + spec.draft * 7.5 - 20} Z`}
              fill={isDraftViolation ? '#881337' : '#0e2417'}
              stroke={isDraftViolation ? '#f43f5e' : '#10b981'}
              strokeWidth="2"
            />

            {/* Cargo Hold Divisions */}
            <line x1="60" y1="30" x2="60" y2="50" stroke="#325e44" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="100" y1="30" x2="100" y2="50" stroke="#325e44" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="140" y1="30" x2="140" y2="50" stroke="#325e44" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="180" y1="30" x2="180" y2="50" stroke="#325e44" strokeWidth="1" strokeDasharray="2 2" />

            {/* Hull Name Label */}
            <text x="120" y="44" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              {vesselClass} (Draft: {spec.draft}m)
            </text>
          </g>

          {/* Depth Scale Ruler on Left */}
          <line x1="40" y1={waterSurfaceY} x2="40" y2={waterSurfaceY + 18.5 * 7.5} stroke="#3d684f" strokeWidth="1.5" />
          {[5, 10, 15, 20].map(d => (
            <g key={d} transform={`translate(35, ${waterSurfaceY + d * 7.5})`}>
              <line x1="0" y1="0" x2="10" y2="0" stroke="#3d684f" strokeWidth="1.5" />
              <text x="-6" y="3" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {d}m
              </text>
            </g>
          ))}
        </svg>

        {/* Breach Alert Pill Overlay */}
        {isDraftViolation && (
          <div className="absolute bottom-2 right-2 bg-rose-600/90 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg flex items-center space-x-1.5 backdrop-blur-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>GROUNDING HAZARD: Hull exceeds permissible channel depth!</span>
          </div>
        )}
      </div>

      {/* Explanatory Operational Intelligence Box */}
      <div className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
        isDraftViolation
          ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
          : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
      }`}>
        <div className="flex items-center space-x-2 font-bold text-xs">
          {isDraftViolation ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>
            {isDraftViolation
              ? `Operational Gatekeeper Warning: ${vesselClass} Restricted at ${portName}`
              : `Operational Clearance: ${vesselClass} Fully Compatible with ${portName}`}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {isHaldia
            ? 'Haldia Dock Complex is a riverine lock system with sandbar siltation restricting loaded draft to 8.5m. Capesize and Panamax vessels require offshore lightering at Sagar Deepwater Anchorage (+ $4.85/MT tariff).'
            : isDraftViolation
            ? `Vessel draft of ${spec.draft}m breaches the port navigational ceiling of ${port.maxDraft}m by ${draftDiff.toFixed(1)}m. Direct berthing will be rejected by port authorities. Recommend short-loading to ${port.maxDraft}m draft or diverting to Gangavaram (19.0m) or Dhamra (18.5m).`
            : `Safe Under-Keel Clearance (UKC) maintained. Port channel depth of ${port.maxDraft}m exceeds vessel arrival draft of ${spec.draft}m with ${(port.maxDraft - spec.draft).toFixed(1)}m safety margin.`}
        </p>
      </div>

      {/* Key Vessel Parameters Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="bg-[#0a1410] p-2.5 rounded-lg border border-[#193324]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Deadweight (DWT)</span>
          <strong className="text-white font-mono text-sm">{spec.dwt}</strong>
        </div>
        <div className="bg-[#0a1410] p-2.5 rounded-lg border border-[#193324]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Length Overall (LOA)</span>
          <strong className="text-white font-mono text-sm">{spec.loa}</strong>
        </div>
        <div className="bg-[#0a1410] p-2.5 rounded-lg border border-[#193324]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Max Beam Width</span>
          <strong className="text-white font-mono text-sm">{spec.beam}</strong>
        </div>
        <div className="bg-[#0a1410] p-2.5 rounded-lg border border-[#193324]">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Daily Charter Benchmark</span>
          <strong className="text-amber-300 font-mono text-sm">{spec.dailyCharter}/d</strong>
        </div>
      </div>
    </div>
  );
}
