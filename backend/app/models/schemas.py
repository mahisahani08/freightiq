from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- Master Data Schemas ---
class BerthInfo(BaseModel):
    berth_id: str
    berth_name: str
    max_draft_m: float
    max_loa_m: float
    max_beam_m: float
    discharge_rate_tpd: float  # Tonnes per day
    cargo_types: List[str]

class PortDetail(BaseModel):
    port_id: str
    port_name: str
    country: str
    region: str
    max_draft_m: float
    max_loa_m: float
    max_beam_m: float
    tidal_restriction: bool
    requires_lighterage: bool
    typical_waiting_days: float
    avg_turnaround_days: float
    railway_rake_capacity_tpd: float
    storage_capacity_mt: float
    berths: List[BerthInfo]
    verified_status: str  # "VERIFIED_PORT_TRUST_DATA" or "DEMO_CALIBRATED"

class VesselSpecification(BaseModel):
    vessel_class: str  # Handysize, Supramax, Panamax, Capesize
    dwt_min: int
    dwt_max: int
    typical_dwt: int
    typical_draft_m: float
    typical_loa_m: float
    typical_beam_m: float
    daily_hire_usd: float
    bunker_consumption_tpd: float
    demurrage_rate_per_day_usd: float

class RouteProfile(BaseModel):
    route_id: str
    origin_country: str
    origin_port: str
    destination_port: str
    distance_nm: int
    typical_steaming_days: float
    primary_commodity: str
    chokepoint_notes: str

# --- Forecasting Schemas ---
class ForecastRequest(BaseModel):
    vessel_class: str = "Capesize"
    route_id: Optional[str] = "AUS_HAY_PARADIP"
    horizon_days: int = 30  # 7, 14, 30, 60

class ForecastPoint(BaseModel):
    date: str
    predicted_rate_usd_per_ton: float
    lower_80: float
    upper_80: float
    lower_95: float
    upper_95: float
    trend_direction: str  # "UP", "DOWN", "STABLE"

class ForecastResponse(BaseModel):
    vessel_class: str
    route_id: str
    current_spot_rate_usd: float
    forecast_horizon_days: int
    forecast_points: List[ForecastPoint]
    model_used: str
    model_confidence_r2: float
    mean_forecast_rate: float
    percentage_change_projected: float
    market_opportunity_status: str  # "FAVORABLE", "UNFAVORABLE", "NEUTRAL"
    is_demo_calibrated: bool = True

class ModelComparisonMetric(BaseModel):
    model_name: str
    mae: float
    rmse: float
    mape: float
    r2_score: float
    is_best_model: bool

# --- Vessel Compatibility & Landed Cost Schemas ---
class CargoRequest(BaseModel):
    commodity_type: str = "Coking Coal"  # Coking Coal, Iron Ore, Limestone, Manganese Ore
    cargo_quantity_mt: float = 75000
    origin_country: str = "Australia"
    origin_port: str = "Hay Point"
    destination_port: str = "Paradip"
    target_dispatch_days: int = 14

class VesselEvaluationResult(BaseModel):
    vessel_class: str
    is_compatible: bool
    rejection_reasons: List[str]
    compatibility_score: float  # 0 to 100
    parcels_required: int
    cargo_per_vessel_mt: float
    ocean_freight_rate_usd_per_mt: float
    ocean_freight_total_usd: float
    bunker_cost_usd: float
    port_charges_usd: float
    lighterage_cost_usd: float
    estimated_demurrage_usd: float
    total_landed_cost_usd: float
    landed_cost_per_mt_usd: float
    steaming_days: float
    waiting_days: float
    discharge_days: float
    total_voyage_days: float
    rank: int
    recommendation_verdict: str  # "OPTIMAL", "FEASIBLE", "NOT_RECOMMENDED", "PHYSICALLY_REJECTED"

class VesselOptimizationResponse(BaseModel):
    cargo_request: CargoRequest
    route_distance_nm: int
    evaluated_vessels: List[VesselEvaluationResult]
    optimal_vessel_class: Optional[str]
    optimization_summary: str

# --- Charter Recommendation Schemas ---
class CharterDecisionRequest(BaseModel):
    cargo_quantity_mt: float = 75000
    commodity_type: str = "Coking Coal"
    origin_port: str = "Hay Point"
    destination_port: str = "Paradip"
    vessel_class: str = "Capesize"
    target_arrival_days: int = 30

class FactorContribution(BaseModel):
    factor_name: str
    impact: str  # "BULLISH", "BEARISH", "NEUTRAL"
    description: str
    weight: float

class CharterRecommendationResponse(BaseModel):
    verdict: str  # "ENTER_SPOT_NOW", "DEFER_SPOT_BOOKING", "LOCK_SHORT_TERM_TC"
    headline: str
    confidence_level: str  # "HIGH", "MEDIUM", "LOW"
    current_spot_rate_usd: float
    forecasted_rate_usd_30d: float
    expected_cost_delta_usd: float
    expected_savings_percentage: float
    recommended_contract_type: str  # "Spot Voyage Charter", "30-Day Time Charter", "Forward Freight Hedge"
    explainable_factors: List[FactorContribution]
    actionable_takeaway: str

# --- Idle Time & Port Congestion Schemas ---
class IdleTimeRequest(BaseModel):
    port_name: str = "Paradip"
    vessel_class: str = "Capesize"
    cargo_quantity_mt: float = 80000

class IdleTimeResponse(BaseModel):
    port_name: str
    vessel_class: str
    current_queue_vessels: int
    berth_occupancy_rate: float
    estimated_waiting_hours: float
    estimated_waiting_days: float
    estimated_discharge_hours: float
    estimated_discharge_days: float
    total_turnaround_days: float
    demurrage_exposure_usd: float
    congestion_level: str  # "LOW", "MODERATE", "HIGH", "CRITICAL"
    mitigation_options: List[str]
    alternative_ports_suggested: List[Dict[str, Any]]

# --- Risk Intelligence Schemas ---
class RiskAssessmentResponse(BaseModel):
    overall_risk_score: float  # 0 to 100
    overall_risk_category: str  # "LOW", "MEDIUM", "HIGH"
    risk_breakdown: Dict[str, Dict[str, Any]]
    active_alerts: List[str]
    historical_volatility_30d_pct: float
    bunker_fuel_trend: str

# --- Scenario Simulator Schemas ---
class ScenarioSimulationRequest(BaseModel):
    baseline_cargo_mt: float = 75000
    baseline_vessel: str = "Capesize"
    baseline_origin: str = "Hay Point"
    baseline_dest: str = "Paradip"
    bunker_price_delta_pct: float = 0.0  # e.g. +15%
    waiting_time_delta_days: float = 0.0  # e.g. +3 days
    defer_charter_days: int = 14  # wait 14 days to book

class ScenarioOption(BaseModel):
    scenario_id: str
    scenario_name: str
    vessel_class: str
    destination_port: str
    dispatch_window: str
    ocean_freight_usd: float
    bunker_cost_usd: float
    demurrage_risk_usd: float
    lighterage_usd: float
    total_landed_cost_usd: float
    cost_per_mt_usd: float
    cost_variance_vs_base_usd: float
    feasibility_status: str
    risk_rating: str

class ScenarioSimulationResponse(BaseModel):
    baseline_summary: Dict[str, Any]
    scenarios: List[ScenarioOption]
    key_insights: List[str]

# --- Advanced Analytics Schemas ---
class MonteCarloRequest(BaseModel):
    cargo_quantity_mt: float = 75000
    vessel_class: str = "Capesize"
    origin_port: str = "Hay Point"
    destination_port: str = "Paradip"
    num_iterations: int = 1000

class MonteCarloDistributionBin(BaseModel):
    cost_bin: str
    frequency: int
    cumulative_pct: float

class MonteCarloResponse(BaseModel):
    iterations: int
    mean_cost_per_mt_usd: float
    std_dev_usd: float
    p5_best_case_usd: float
    p50_median_usd: float
    p95_var_usd: float
    p99_worst_case_usd: float
    value_at_risk_95_total_usd: float
    expected_shortfall_cvar_95_usd: float
    budget_overrun_probability_pct: float
    distribution_bins: List[MonteCarloDistributionBin]
    key_risk_takeaway: str

class EcoSteamingOption(BaseModel):
    speed_knots: float
    steaming_days: float
    bunker_consumption_total_mt: float
    bunker_cost_usd: float
    charter_hire_cost_usd: float
    port_waiting_exposure_usd: float
    total_voyage_cost_usd: float
    cost_per_mt_usd: float
    co2_emissions_mt: float
    is_optimal_eco: bool

class EcoSteamingResponse(BaseModel):
    vessel_class: str
    route_distance_nm: int
    design_speed_knots: float
    optimal_eco_speed_knots: float
    potential_fuel_savings_usd: float
    co2_reduction_percentage: float
    speed_curves: List[EcoSteamingOption]
    engineering_rationale: str

class MetOceanSeasonalityResponse(BaseModel):
    current_season: str
    bay_of_bengal_alert_level: str
    cyclone_frequency_category: str
    average_wave_swell_height_m: float
    anticipated_weather_delay_days: float
    monsoon_impact_factor: float
    port_seasonal_status: Dict[str, Dict[str, Any]]
    logistics_guidance: str

class FeatureImportanceItem(BaseModel):
    feature_name: str
    category: str
    relative_importance_pct: float
    impact_direction: str
    description: str

class FeatureImportanceResponse(BaseModel):
    model_name: str
    r2_score: float
    features: List[FeatureImportanceItem]
