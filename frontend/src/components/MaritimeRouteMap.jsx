import React, { useState } from 'react';
import { Anchor, Compass, Navigation, Ship, Wind, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const PORTS = [
  { id: 'haldia', name: 'Haldia', x: 442, y: 172, draft: '8.5m', loa: '190m', wait: '4.8 d', lighterage: true, type: 'Riverine Lock' },
  { id: 'sagar', name: 'Sagar / Sandheads', x: 450, y: 184, draft: '20.0m', loa: '330m', wait: '1.2 d', lighterage: false, type: 'Deepwater Anchorage' },
  { id: 'dhamra', name: 'Dhamra', x: 436, y: 198, draft: '18.5m', loa: '310m', wait: '2.1 d', lighterage: false, type: 'Capesize Deepwater' },
  { id: 'paradip', name: 'Paradip', x: 430, y: 214, draft: '14.5m', loa: '260m', wait: '4.2 d', lighterage: false, type: 'Bulk Hub (SAIL Rakes)' },
  { id: 'gopalpur', name: 'Gopalpur', x: 416, y: 232, draft: '12.5m', loa: '225m', wait: '1.8 d', lighterage: false, type: 'Panamax Port' },
  { id: 'vizag', name: 'Visakhapatnam', x: 404, y: 254, draft: '16.5m', loa: '280m', wait: '2.9 d', lighterage: false, type: 'Inner/Outer Harbor' },
  { id: 'gangavaram', name: 'Gangavaram', x: 400, y: 264, draft: '19.0m', loa: '320m', wait: '1.5 d', lighterage: false, type: 'Deepwater Capesize' }
];

const ORIGINS = [
  { id: 'aus_hay', name: 'Hay Point (Australia)', x: 790, y: 360, dist: '4,850 NM', days: '14.5d', cargo: 'Prime Hard Coking Coal' },
  { id: 'aus_gla', name: 'Gladstone (Australia)', x: 805, y: 375, dist: '4,890 NM', days: '14.8d', cargo: 'PCI / Metallurgical Coal' },
  { id: 'ind_tab', name: 'Taboneo (Indonesia)', x: 640, y: 295, dist: '2,290 NM', days: '7.2d', cargo: 'Thermal / Semi-Soft Coal' },
  { id: 'moz_map', name: 'Maputo (Mozambique)', x: 260, y: 390, dist: '4,290 NM', days: '13.2d', cargo: 'Moatize Coking Coal' },
  { id: 'rus_tam', name: 'Taman (Russia/Black Sea)', x: 190, y: 110, dist: '5,280 NM', days: '16.0d', cargo: 'PCI Coal (via Suez)' },
  { id: 'usa_hmp', name: 'Hampton Roads (USA)', x: 90, y: 155, dist: '11,300 NM', days: '34.0d', cargo: 'High-Vol Coking Coal (Cape)' }
];

export default function MaritimeRouteMap({ selectedPort = 'Paradip', onSelectPort }) {
  const [activePin, setActivePin] = useState(null);
  const [activeOrigin, setActiveOrigin] = useState(ORIGINS[0]);

  const targetPort = PORTS.find(p => p.name.toLowerCase().includes(selectedPort.toLowerCase())) || PORTS[3];

  return (
    <div className="bg-gradient-to-br from-[#08140e] via-[#0d2116] to-[#060c08] rounded-2xl p-5 text-white shadow-2xl border border-emerald-900/40 relative overflow-hidden">
      {/* Decorative Grid Lines & Radar Rings */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e442d_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3d28] pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-emerald-400" />
            <span>Interactive Maritime Corridor Radar</span>
            <span className="text-amber-400">•</span>
            <span className="text-slate-300">East Coast India Inbound Lanes</span>
          </div>
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Geospatial Route & Navigational Infrastructure Gate</span>
          </h3>
        </div>

        {/* Origin Quick Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-[10px] text-slate-400 font-medium mr-1">Load Origin:</span>
          {ORIGINS.map(org => (
            <button
              key={org.id}
              onClick={() => setActiveOrigin(org)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                activeOrigin.id === org.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-[#0b1b12] text-slate-300 hover:text-white hover:bg-[#12281c] border border-[#1b3d28]'
              }`}
            >
              {org.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Radar Map */}
      <div className="relative w-full h-80 sm:h-96 my-2 flex items-center justify-center select-none">
        <svg
          viewBox="0 0 900 480"
          className="w-full h-full max-h-[420px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0e2a1d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#060c08" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="routeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean Water Background Accent */}
          <rect width="900" height="480" fill="url(#oceanGlow)" rx="16" />

          {/* Nautical Latitude / Longitude Grid lines */}
          <line x1="50" y1="120" x2="850" y2="120" stroke="#163321" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <line x1="50" y1="240" x2="850" y2="240" stroke="#1e452c" strokeWidth="1" strokeDasharray="4 6" opacity="0.8" />
          <line x1="50" y1="360" x2="850" y2="360" stroke="#163321" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <line x1="220" y1="50" x2="220" y2="440" stroke="#163321" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <line x1="450" y1="50" x2="450" y2="440" stroke="#1e452c" strokeWidth="1" strokeDasharray="4 6" opacity="0.8" />
          <line x1="680" y1="50" x2="680" y2="440" stroke="#163321" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />

          {/* Stylized Continents & Coastlines */}
          {/* Indian Subcontinent Path */}
          <path
            d="M 330 70 L 370 70 L 410 90 L 450 110 L 460 140 L 452 170 L 444 195 L 434 214 L 418 234 L 406 254 L 398 270 L 380 295 L 366 315 L 350 300 L 338 275 L 326 240 L 320 200 L 315 150 L 325 110 Z"
            fill="#12241b"
            stroke="#1d4532"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Sri Lanka */}
          <path
            d="M 378 322 C 385 322 390 332 388 340 C 385 348 375 348 372 340 Z"
            fill="#12241b"
            stroke="#1d4532"
            strokeWidth="1"
          />

          {/* Arabian Peninsula & Middle East */}
          <path
            d="M 180 130 L 250 130 L 260 160 L 275 190 L 265 220 L 240 240 L 210 230 L 195 190 Z"
            fill="#0f1d16"
            stroke="#183827"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* East Africa */}
          <path
            d="M 210 240 L 240 260 L 250 290 L 260 340 L 255 390 L 245 420 L 220 440 L 190 400 L 180 320 L 190 260 Z"
            fill="#0f1d16"
            stroke="#183827"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Southeast Asia & Indonesia */}
          <path
            d="M 520 130 L 560 140 L 580 180 L 565 230 L 550 260 L 538 280 L 555 285 L 590 270 L 630 260 L 660 280 L 670 320 L 630 330 L 570 335 L 520 300 Z"
            fill="#0f1d16"
            stroke="#183827"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Australia */}
          <path
            d="M 720 330 L 760 310 L 800 320 L 830 350 L 840 400 L 810 435 L 750 435 L 710 400 L 715 360 Z"
            fill="#0f1d16"
            stroke="#183827"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Active Corridor Shipping Lane (Curve from Origin to Selected Port) */}
          <path
            d={`M ${activeOrigin.x} ${activeOrigin.y} Q ${(activeOrigin.x + targetPort.x) / 2 + 30} ${(activeOrigin.y + targetPort.y) / 2 + 50} ${targetPort.x} ${targetPort.y}`}
            fill="none"
            stroke="url(#routeLineGrad)"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            className="animate-pulse"
            filter="url(#glowEffect)"
          />

          {/* Secondary Shipping Route Network Lanes */}
          <path
            d="M 790 360 Q 620 330 430 214"
            fill="none"
            stroke="#1d402b"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.5"
          />
          <path
            d="M 260 390 Q 330 340 404 254"
            fill="none"
            stroke="#1d402b"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.5"
          />
          <path
            d="M 640 295 Q 520 280 436 198"
            fill="none"
            stroke="#1d402b"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.5"
          />

          {/* Animated Vessel traversing the active lane */}
          <circle
            cx={(activeOrigin.x * 0.45 + targetPort.x * 0.55)}
            cy={(activeOrigin.y * 0.45 + targetPort.y * 0.55 + 25)}
            r="6"
            fill="#fbbf24"
            filter="url(#glowEffect)"
          >
            <animate
              attributeName="r"
              values="5;8;5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* International Origin Nodes */}
          {ORIGINS.map(org => {
            const isSelected = activeOrigin.id === org.id;
            return (
              <g
                key={org.id}
                onClick={() => setActiveOrigin(org)}
                className="cursor-pointer group"
                transform={`translate(${org.x}, ${org.y})`}
              >
                {isSelected && (
                  <circle r="14" fill="#f59e0b" opacity="0.25" className="animate-ping" />
                )}
                <circle
                  r={isSelected ? 7 : 5}
                  fill={isSelected ? '#f59e0b' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="4"
                  fill={isSelected ? '#fbbf24' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="sans-serif"
                >
                  {org.name.split(' (')[0]}
                </text>
              </g>
            );
          })}

          {/* Indian East Coast Port Nodes */}
          {PORTS.map(port => {
            const isSelected = targetPort.id === port.id;
            return (
              <g
                key={port.id}
                onClick={() => {
                  if (onSelectPort) onSelectPort(port.name);
                  setActivePin(port);
                }}
                className="cursor-pointer group"
                transform={`translate(${port.x}, ${port.y})`}
              >
                {isSelected && (
                  <>
                    <circle r="16" fill="#10b981" opacity="0.3" className="animate-ping" />
                    <circle r="10" fill="#10b981" opacity="0.5" />
                  </>
                )}
                <circle
                  r={isSelected ? 6 : 4.5}
                  fill={isSelected ? '#10b981' : port.lighterage ? '#f59e0b' : '#34d399'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x="-8"
                  y="-8"
                  textAnchor="end"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'medium'}
                  fontFamily="sans-serif"
                >
                  {port.name} ({port.draft})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Telemetry HUD Card on Active Route */}
        <div className="absolute bottom-2 left-2 bg-[#09150e]/90 backdrop-blur-md border border-emerald-500/40 rounded-xl p-3 text-xs max-w-xs shadow-xl hidden md:block">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1b3d28] mb-2">
            <span className="font-extrabold text-emerald-300 text-[11px] flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Voyage Telemetry</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Open Route
            </span>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Sailing Distance:</span>
              <strong className="text-white">{activeOrigin.dist}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Voyage Duration:</span>
              <strong className="text-amber-300">~{activeOrigin.days} (@ 13.5 kts)</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Discharge Port:</span>
              <strong className="text-emerald-300">{targetPort.name}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Permissible Draft:</span>
              <strong className={targetPort.lighterage ? 'text-amber-400' : 'text-white'}>
                {targetPort.draft} {targetPort.lighterage && '(Lighterage)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Port Quick Selector Strip */}
      <div className="mt-3 pt-3 border-t border-[#1b3d28] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 text-[11px]">
          <Anchor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">East Coast Terminal Grid:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PORTS.map(port => {
            const isSelected = targetPort.id === port.id;
            return (
              <button
                key={port.id}
                onClick={() => {
                  if (onSelectPort) onSelectPort(port.name);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#0e2116] text-slate-300 hover:text-white border border-[#1b3d28]'
                }`}
              >
                <span>{port.name}</span>
                <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-black/20 text-slate-950 font-extrabold' : 'bg-emerald-950/80 text-emerald-300'}`}>
                  {port.draft}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
