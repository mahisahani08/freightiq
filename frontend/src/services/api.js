/**
 * API client service for FreightIQ backend endpoints.
 */
const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function fetchPortsData() {
  const res = await fetch(`${API_BASE}/ports`);
  if (!res.ok) throw new Error('Failed to fetch ports data');
  return res.json();
}

export async function fetchVesselsData() {
  const res = await fetch(`${API_BASE}/vessels`);
  if (!res.ok) throw new Error('Failed to fetch vessel specifications');
  return res.json();
}

export async function fetchForecast(vesselClass = 'Capesize', routeId = 'AUS_HAY_PARADIP', horizonDays = 30) {
  const res = await fetch(`${API_BASE}/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vessel_class: vesselClass,
      route_id: routeId,
      horizon_days: horizonDays,
    }),
  });
  if (!res.ok) throw new Error('Failed to generate forecast');
  return res.json();
}

export async function fetchModelPerformance(vesselClass = 'Capesize') {
  const res = await fetch(`${API_BASE}/models/performance?vessel_class=${vesselClass}`);
  if (!res.ok) throw new Error('Failed to fetch model performance metrics');
  return res.json();
}

export async function optimizeVessel(cargoParams) {
  const res = await fetch(`${API_BASE}/vessels/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cargoParams),
  });
  if (!res.ok) throw new Error('Failed to optimize vessel selection');
  return res.json();
}

export async function fetchCharterRecommendation(params) {
  const res = await fetch(`${API_BASE}/charter/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch charter recommendation');
  return res.json();
}

export async function analyzeIdleTime(params) {
  const res = await fetch(`${API_BASE}/idle/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to analyze idle time and demurrage');
  return res.json();
}

export async function fetchRiskProfile() {
  const res = await fetch(`${API_BASE}/risk/profile`);
  if (!res.ok) throw new Error('Failed to fetch risk profile');
  return res.json();
}

export async function simulateScenarios(params) {
  const res = await fetch(`${API_BASE}/scenarios/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to run scenario simulation');
  return res.json();
}

export async function fetchDecisionHistory(limit = 20) {
  const res = await fetch(`${API_BASE}/decisions/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch decision history');
  return res.json();
}

// Advanced Analytics Endpoints
export async function fetchMonteCarloSimulation(params = {}) {
  const res = await fetch(`${API_BASE}/risk/monte-carlo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin_port: params.origin_port || 'Hay Point',
      dest_port: params.dest_port || 'Paradip',
      vessel_class: params.vessel_class || 'Capesize',
      cargo_quantity_mt: params.cargo_quantity_mt || 150000,
      iterations: params.iterations || 1000
    }),
  });
  if (!res.ok) throw new Error('Failed to execute Monte Carlo simulation');
  return res.json();
}

export async function fetchEcoSteamingCurves(vesselClass = 'Capesize', distanceNm = 4850) {
  const res = await fetch(`${API_BASE}/vessels/eco-steaming?vessel_class=${vesselClass}&distance_nm=${distanceNm}`);
  if (!res.ok) throw new Error('Failed to fetch eco-steaming curves');
  return res.json();
}

export async function fetchMetoceanSeasonality() {
  const res = await fetch(`${API_BASE}/ports/metocean`);
  if (!res.ok) throw new Error('Failed to fetch metocean seasonality');
  return res.json();
}

export async function fetchFeatureImportance() {
  const res = await fetch(`${API_BASE}/models/feature-importance`);
  if (!res.ok) throw new Error('Failed to fetch feature importance');
  return res.json();
}
