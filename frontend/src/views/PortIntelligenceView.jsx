import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Train,
  AlertTriangle,
  Compass,
  Ship,
  MapPin,
  CheckCircle2,
  Waves,
  ArrowRight,
  Wind,
  ShieldAlert
} from 'lucide-react';
import { fetchPortsData, fetchMetoceanSeasonality } from '../services/api';

const DEFAULT_PORTS_DATA = {
  east_coast_ports: {
    Paradip: {
      port_id: "IN_PRT",
      port_name: "Paradip Port",
      country: "India",
      region: "Odisha Coast",
      max_draft_m: 14.5,
      max_loa_m: 260.0,
      max_beam_m: 43.0,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 4.2,
      avg_turnaround_days: 6.8,
      railway_rake_capacity_tpd: 45000,
      rail_connectivity: "Direct mainline link to Rourkela (RSP) & Bokaro Steel Plant (BSL) via South Eastern Railway.",
      berths: [
        { berth_id: "CQ1", berth_name: "Central Quay 1 (Mechanized Coal)", max_draft_m: 14.5, max_loa_m: 260.0, discharge_rate_tpd: 35000, cargo_types: ["Coking Coal", "Thermal Coal"] },
        { berth_id: "CQ2", berth_name: "Central Quay 2 (Iron Ore / Bulk)", max_draft_m: 14.5, max_loa_m: 250.0, discharge_rate_tpd: 30000, cargo_types: ["Iron Ore", "Limestone"] },
        { berth_id: "MPB", berth_name: "Multi-Purpose Berth", max_draft_m: 13.0, max_loa_m: 230.0, discharge_rate_tpd: 20000, cargo_types: ["General Bulk", "Fluxes"] }
      ]
    },
    Dhamra: {
      port_id: "IN_DHM",
      port_name: "Dhamra Port (Adani)",
      country: "India",
      region: "Odisha Coast",
      max_draft_m: 18.5,
      max_loa_m: 310.0,
      max_beam_m: 48.0,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 2.1,
      avg_turnaround_days: 4.2,
      railway_rake_capacity_tpd: 60000,
      rail_connectivity: "62 km private rail link connecting directly to Bhadrak main rail spine for Rourkela & Bokaro.",
      berths: [
        { berth_id: "DHM_B1", berth_name: "Deep Draft Bulk Berth 1", max_draft_m: 18.5, max_loa_m: 310.0, discharge_rate_tpd: 50000, cargo_types: ["Coking Coal", "PCI Coal"] },
        { berth_id: "DHM_B2", berth_name: "Deep Draft Bulk Berth 2", max_draft_m: 18.0, max_loa_m: 290.0, discharge_rate_tpd: 45000, cargo_types: ["Thermal Coal", "Iron Ore Pellets"] }
      ]
    },
    Visakhapatnam: {
      port_id: "IN_VTZ",
      port_name: "Visakhapatnam Port",
      country: "India",
      region: "Andhra Pradesh",
      max_draft_m: 16.5,
      max_loa_m: 280.0,
      max_beam_m: 45.0,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 2.9,
      avg_turnaround_days: 5.1,
      railway_rake_capacity_tpd: 40000,
      rail_connectivity: "East Coast Railway freight spine directly connected to Bhilai Steel Plant (BSP).",
      berths: [
        { berth_id: "OB1", berth_name: "Outer Harbor Coal Berth", max_draft_m: 16.5, max_loa_m: 280.0, discharge_rate_tpd: 30000, cargo_types: ["Coking Coal", "Anthracite"] },
        { berth_id: "WOB", berth_name: "West Ore Berth", max_draft_m: 14.5, max_loa_m: 250.0, discharge_rate_tpd: 25000, cargo_types: ["Manganese Ore", "Iron Ore"] }
      ]
    },
    Gangavaram: {
      port_id: "IN_GGV",
      port_name: "Gangavaram Port",
      country: "India",
      region: "Andhra Pradesh",
      max_draft_m: 19.0,
      max_loa_m: 320.0,
      max_beam_m: 50.0,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 1.5,
      avg_turnaround_days: 3.5,
      railway_rake_capacity_tpd: 55000,
      rail_connectivity: "Adjacent to RINL steel complex with direct railway dispatch line to Bhilai Steel Plant.",
      berths: [
        { berth_id: "GVP_C1", berth_name: "Super-Capesize Coal Berth 1", max_draft_m: 19.0, max_loa_m: 320.0, discharge_rate_tpd: 55000, cargo_types: ["Prime Coking Coal", "PCI Coal"] },
        { berth_id: "GVP_C2", berth_name: "Multi-Commodity Deep Berth 2", max_draft_m: 18.0, max_loa_m: 300.0, discharge_rate_tpd: 40000, cargo_types: ["Limestone", "Dolomite"] }
      ]
    },
    Gopalpur: {
      port_id: "IN_GOP",
      port_name: "Gopalpur Port",
      country: "India",
      region: "Odisha Coast",
      max_draft_m: 12.5,
      max_loa_m: 225.0,
      max_beam_m: 32.5,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 1.8,
      avg_turnaround_days: 4.0,
      railway_rake_capacity_tpd: 25000,
      rail_connectivity: "Broad gauge spur to Howrah-Chennai mainline connecting to Rourkela and Kalinganagar.",
      berths: [
        { berth_id: "GPL_B1", berth_name: "Panamax Berth 1", max_draft_m: 12.5, max_loa_m: 225.0, discharge_rate_tpd: 20000, cargo_types: ["Coking Coal", "Iron Ore"] }
      ]
    },
    Haldia: {
      port_id: "IN_HAL",
      port_name: "Haldia Dock Complex",
      country: "India",
      region: "West Bengal (Hooghly Estuary)",
      max_draft_m: 8.5,
      max_loa_m: 190.0,
      max_beam_m: 28.0,
      tidal_restriction: true,
      requires_lighterage: true,
      typical_waiting_days: 4.8,
      avg_turnaround_days: 7.2,
      railway_rake_capacity_tpd: 35000,
      rail_connectivity: "Direct South Eastern Railway line servicing Durgapur Steel Plant (DSP) and IISCO Burnpur.",
      berths: [
        { berth_id: "HDC_B4", berth_name: "Berth 4A (Mechanized Coal)", max_draft_m: 8.5, max_loa_m: 190.0, discharge_rate_tpd: 15000, cargo_types: ["Coking Coal (Lightered)"] },
        { berth_id: "HDC_B8", berth_name: "Berth 8 (Iron Ore / Fluxes)", max_draft_m: 8.2, max_loa_m: 185.0, discharge_rate_tpd: 12000, cargo_types: ["Limestone", "Iron Ore"] }
      ]
    },
    'Sagar-Sandheads': {
      port_id: "IN_SGR",
      port_name: "Sagar Deepwater Anchorage / Sandheads",
      country: "India",
      region: "Bay of Bengal (Offshore Anchorage)",
      max_draft_m: 20.0,
      max_loa_m: 330.0,
      max_beam_m: 55.0,
      tidal_restriction: false,
      requires_lighterage: false,
      typical_waiting_days: 1.2,
      avg_turnaround_days: 3.0,
      railway_rake_capacity_tpd: 0,
      rail_connectivity: "Offshore lighterage point. Transshipment via sea-barges directly to inland locks at Haldia and Kolkata.",
      berths: [
        { berth_id: "SGR_ANC", berth_name: "Deepwater Floating Transshipment Anchorage", max_draft_m: 20.0, max_loa_m: 330.0, discharge_rate_tpd: 25000, cargo_types: ["Capesize Bulk Coal Lighterage"] }
      ]
    }
  }
};

export default function PortIntelligenceView() {
  const [portsData, setPortsData] = useState(DEFAULT_PORTS_DATA);
  const [selectedPort, setSelectedPort] = useState('Paradip');
  const [metoceanData, setMetoceanData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [data, met] = await Promise.all([
          fetchPortsData().catch(() => null),
          fetchMetoceanSeasonality().catch(() => null)
        ]);
        if (data && data.east_coast_ports) {
          setPortsData(data);
        }
        if (met) {
          setMetoceanData(met);
        }
      } catch (err) {
        console.error('Background port update error (using default data):', err);
      }
    }
    load();
  }, []);

  const portMap = portsData?.east_coast_ports || DEFAULT_PORTS_DATA.east_coast_ports;
  const port = portMap[selectedPort] || portMap['Paradip'] || Object.values(portMap)[0];
  const portMetocean = metoceanData?.port_seasonal_status?.[selectedPort];

  return (
    <div className="space-y-6">
      {/* Port Switcher Bar with Jade Tabs */}
      <div className="fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#193324] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-emerald-400" />
              <span>East Coast Indian Port Master & Navigational Gatekeeper</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified draft, LOA, beam restrictions, mechanized discharge rates, and rail rake connectivity for SAIL inbound bulk terminals.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-xl border border-emerald-800/60 font-bold">
            Official Port Trust Master Handbooks
          </span>
        </div>

        {/* Port Segmented Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(portMap).map((pName) => {
            const isSelected = selectedPort === pName;
            return (
              <button
                key={pName}
                onClick={() => setSelectedPort(pName)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40'
                    : 'bg-[#0a1410] text-slate-300 hover:text-white hover:bg-[#12241b] border border-[#193324]'
                }`}
              >
                <Anchor className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-slate-500'}`} />
                <span>{pName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metocean Seasonality Banner in Jade & Amber */}
      {metoceanData && (
        <div className="bg-[#0d1813] border border-emerald-900/50 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Bay of Bengal Metocean Condition:</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800/60">
                  {metoceanData.current_season}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Significant wave height: <span className="text-emerald-300 font-mono font-bold">{metoceanData.average_wave_swell_height_m}m</span> • Weather voyage delay factor: <span className="text-amber-300 font-mono font-bold">+{metoceanData.anticipated_weather_delay_days} days</span>
              </p>
            </div>
          </div>
          {portMetocean && (
            <div className="text-xs bg-[#0a1410] border border-[#193324] px-3.5 py-2 rounded-xl text-slate-300 shrink-0">
              <span className="text-slate-400 text-[10px] block font-semibold">{selectedPort} Status:</span>
              <span className="font-bold text-emerald-300">{portMetocean.berthing_status}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{portMetocean.pilotage_restriction}</span>
            </div>
          )}
        </div>
      )}

      {/* Selected Port Detailed View */}
      {port && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Navigational & Physical Constraints */}
          <div className="fi-card p-5 space-y-4 border-t-4 border-t-amber-500">
            <div className="flex items-center justify-between border-b border-[#193324] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">{port.port_name || selectedPort} Terminal</h3>
                <span className="text-xs text-slate-400 font-medium">{port.region}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/60">
                {port.port_id}
              </span>
            </div>

            {/* Graphical Depth & LOA Meters */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0a1410] p-3 rounded-xl border border-[#193324] text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Max Draft</span>
                <span className="text-xl font-extrabold text-emerald-300 font-mono">{port.max_draft_m}m</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${port.max_draft_m >= 18.0 ? 'bg-emerald-400' : port.max_draft_m >= 14.0 ? 'bg-teal-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, (port.max_draft_m / 20.0) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-[#0a1410] p-3 rounded-xl border border-[#193324] text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Max LOA</span>
                <span className="text-xl font-extrabold text-white font-mono">{port.max_loa_m}m</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (port.max_loa_m / 350.0) * 100)}%` }} />
                </div>
              </div>
              <div className="bg-[#0a1410] p-3 rounded-xl border border-[#193324] text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Max Beam</span>
                <span className="text-xl font-extrabold text-teal-300 font-mono">{port.max_beam_m}m</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: `${Math.min(100, (port.max_beam_m / 60.0) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-[#0a1410] p-3.5 rounded-xl border border-[#193324] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Anchorage Wait:</span>
                <span className="text-white font-bold">{port.typical_waiting_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Port Turnaround:</span>
                <span className="text-white font-bold">{port.avg_turnaround_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tidal Restriction:</span>
                <span className={port.tidal_restriction ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {port.tidal_restriction ? 'Tidal Draft Windows' : 'All-Weather Deep Draft'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lighterage Requirement:</span>
                <span className={port.requires_lighterage ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {port.requires_lighterage ? 'Mandatory (Sandheads Anchorage)' : 'Direct Berth Capable'}
                </span>
              </div>
            </div>

            {/* Railway Rake Evacuation */}
            <div className="p-3.5 bg-gradient-to-br from-[#0e2116] to-[#0a1410] rounded-xl border border-emerald-800/40 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-300 font-bold text-xs">
                <Train className="w-4 h-4 text-emerald-400" />
                <span>Railway Rake Evacuation Logistics</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {port.rail_connectivity}
              </p>
              <div className="flex justify-between text-xs text-slate-400 pt-1.5 border-t border-[#193324] font-mono font-semibold">
                <span>Rake Evacuation Capacity:</span>
                <span className="text-amber-300 font-extrabold">{(port.railway_rake_capacity_tpd || 0).toLocaleString()} TPD</span>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Mechanized Berths */}
          <div className="lg:col-span-2 fi-card p-5 space-y-4 border-t-4 border-t-emerald-500">
            <div className="flex items-center justify-between border-b border-[#193324] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Mechanized Bulk Cargo Berths
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Designated handling berths for coking coal, iron ore, and limestone</p>
              </div>
              <span className="text-xs font-mono text-emerald-300 font-semibold bg-[#0a1410] px-3 py-1 rounded-xl border border-[#193324]">
                {(port.berths || []).length} Berths Operational
              </span>
            </div>

            <div className="space-y-3">
              {(port.berths || []).map((b) => {
                const cargoList = Array.isArray(b?.cargo_types)
                  ? b.cargo_types
                  : Array.isArray(b?.handled_commodities)
                  ? b.handled_commodities
                  : ['Bulk Cargo', 'Coking Coal'];

                return (
                  <div key={b.berth_id || Math.random()} className="bg-[#0a1410] border border-[#193324] rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.berth_name}</h4>
                        <span className="text-xs text-emerald-400 font-mono font-semibold">{b.berth_id}</span>
                      </div>
                      <span className="text-xs text-amber-300 font-extrabold font-mono bg-amber-950/70 px-3 py-1 rounded-lg border border-amber-800/60 shadow-xs">
                        {(b.discharge_rate_tpd || 0).toLocaleString()} MT / Day
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-[#0d1813] p-2.5 rounded-lg border border-[#193324]">
                        <span className="text-slate-400 block text-[10px] font-semibold">Permissible Draft:</span>
                        <span className="font-extrabold text-emerald-300 font-mono">{b.max_draft_m}m</span>
                      </div>
                      <div className="bg-[#0d1813] p-2.5 rounded-lg border border-[#193324]">
                        <span className="text-slate-400 block text-[10px] font-semibold">Permissible LOA:</span>
                        <span className="font-extrabold text-white font-mono">{b.max_loa_m}m</span>
                      </div>
                      <div className="bg-[#0d1813] p-2.5 rounded-lg border border-[#193324]">
                        <span className="text-slate-400 block text-[10px] font-semibold">Cargo Focus:</span>
                        <span className="font-bold text-slate-200">{cargoList.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Haldia Riverine Special Notice */}
            {port.requires_lighterage && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl text-xs space-y-1.5 text-amber-200">
                <div className="flex items-center space-x-1.5 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Riverine Sandheads Lighterage Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  Due to the Auckland and Jellingham riverine sandbar draft restrictions in the Hooghly estuary, Capesize vessels cannot enter Haldia Dock Complex fully laden. Mandatory lightering must be performed at Sagar Deepwater Anchorage (+ $4.85/MT tariff).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
