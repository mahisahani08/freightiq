"""
What-If Scenario Simulator for Chartering and Bulk Cargo Procurement.
Enables procurement officers to test alternative decisions:
- Booking today vs waiting 14/30 days
- Alternative vessel selection
- Alternative discharge port routing
- Bunker fuel and port congestion sensitivity stress-tests
"""
from typing import Dict, List, Any
from app.models.schemas import ScenarioSimulationRequest, ScenarioSimulationResponse, ScenarioOption
from app.core.vessel_optimizer import evaluate_vessel_options
from app.models.schemas import CargoRequest

def run_what_if_simulation(req: ScenarioSimulationRequest) -> ScenarioSimulationResponse:
    # 1. Base Case
    base_cargo_req = CargoRequest(
        commodity_type="Coking Coal",
        cargo_quantity_mt=req.baseline_cargo_mt,
        origin_country="Australia",
        origin_port=req.baseline_origin,
        destination_port=req.baseline_dest
    )
    base_opt = evaluate_vessel_options(base_cargo_req)
    base_vessel_eval = next(
        (v for v in base_opt.evaluated_vessels if v.vessel_class == req.baseline_vessel),
        base_opt.evaluated_vessels[0]
    )

    base_total = base_vessel_eval.total_landed_cost_usd
    base_per_mt = base_vessel_eval.landed_cost_per_mt_usd

    scenarios: List[ScenarioOption] = []

    # Scenario 0: Baseline
    scenarios.append(ScenarioOption(
        scenario_id="SCENARIO_BASE",
        scenario_name=f"Baseline: Immediate Spot Charter ({req.baseline_vessel} to {req.baseline_dest})",
        vessel_class=req.baseline_vessel,
        destination_port=req.baseline_dest,
        dispatch_window="Immediate (Days 0-5)",
        ocean_freight_usd=base_vessel_eval.ocean_freight_total_usd,
        bunker_cost_usd=base_vessel_eval.bunker_cost_usd,
        demurrage_risk_usd=base_vessel_eval.estimated_demurrage_usd,
        lighterage_usd=base_vessel_eval.lighterage_cost_usd,
        total_landed_cost_usd=base_total,
        cost_per_mt_usd=base_per_mt,
        cost_variance_vs_base_usd=0.0,
        feasibility_status="FEASIBLE" if base_vessel_eval.is_compatible else "PHYSICALLY_RESTRICTED",
        risk_rating="MEDIUM"
    ))

    # Scenario 1: Defer Booking by 14 Days
    # Using forecast trend
    rate_multiplier = 0.94 if base_vessel_eval.ocean_freight_rate_usd_per_mt > 18.0 else 1.05
    s1_ocean = round(base_vessel_eval.ocean_freight_total_usd * rate_multiplier, 2)
    s1_total = round(s1_ocean + base_vessel_eval.bunker_cost_usd + base_vessel_eval.port_charges_usd + base_vessel_eval.lighterage_cost_usd + base_vessel_eval.estimated_demurrage_usd, 2)
    s1_var = round(s1_total - base_total, 2)

    scenarios.append(ScenarioOption(
        scenario_id="SCENARIO_DEFER",
        scenario_name=f"Defer Booking Window ({req.defer_charter_days} Days Forward)",
        vessel_class=req.baseline_vessel,
        destination_port=req.baseline_dest,
        dispatch_window=f"+{req.defer_charter_days} Days Deferred",
        ocean_freight_usd=s1_ocean,
        bunker_cost_usd=base_vessel_eval.bunker_cost_usd,
        demurrage_risk_usd=base_vessel_eval.estimated_demurrage_usd,
        lighterage_usd=base_vessel_eval.lighterage_cost_usd,
        total_landed_cost_usd=s1_total,
        cost_per_mt_usd=round(s1_total / req.baseline_cargo_mt, 2),
        cost_variance_vs_base_usd=s1_var,
        feasibility_status="FEASIBLE",
        risk_rating="LOW" if s1_var < 0 else "HIGH"
    ))

    # Scenario 2: Alternative Vessel Class
    alt_vessel = "Capesize" if req.baseline_vessel != "Capesize" else "Panamax"
    alt_eval = next((v for v in base_opt.evaluated_vessels if v.vessel_class == alt_vessel), None)
    if alt_eval:
        s2_var = round(alt_eval.total_landed_cost_usd - base_total, 2)
        scenarios.append(ScenarioOption(
            scenario_id="SCENARIO_ALT_VESSEL",
            scenario_name=f"Alternative Vessel: Switch to {alt_vessel}",
            vessel_class=alt_vessel,
            destination_port=req.baseline_dest,
            dispatch_window="Prompt Dispatch",
            ocean_freight_usd=alt_eval.ocean_freight_total_usd,
            bunker_cost_usd=alt_eval.bunker_cost_usd,
            demurrage_risk_usd=alt_eval.estimated_demurrage_usd,
            lighterage_usd=alt_eval.lighterage_cost_usd,
            total_landed_cost_usd=alt_eval.total_landed_cost_usd,
            cost_per_mt_usd=alt_eval.landed_cost_per_mt_usd,
            cost_variance_vs_base_usd=s2_var,
            feasibility_status="FEASIBLE" if alt_eval.is_compatible else "RESTRICTED",
            risk_rating="LOW" if s2_var < 0 else "MEDIUM"
        ))

    # Scenario 3: Alternative Deepwater Port (e.g., Dhamra or Gangavaram)
    alt_port = "Dhamra" if req.baseline_dest != "Dhamra" else "Visakhapatnam"
    alt_port_cargo_req = CargoRequest(
        commodity_type="Coking Coal",
        cargo_quantity_mt=req.baseline_cargo_mt,
        origin_country="Australia",
        origin_port=req.baseline_origin,
        destination_port=alt_port
    )
    alt_port_opt = evaluate_vessel_options(alt_port_cargo_req)
    alt_port_eval = next(
        (v for v in alt_port_opt.evaluated_vessels if v.vessel_class == req.baseline_vessel),
        alt_port_opt.evaluated_vessels[0]
    )
    s3_var = round(alt_port_eval.total_landed_cost_usd - base_total, 2)
    scenarios.append(ScenarioOption(
        scenario_id="SCENARIO_ALT_PORT",
        scenario_name=f"Alternative Discharge Port: Divert to {alt_port}",
        vessel_class=req.baseline_vessel,
        destination_port=alt_port,
        dispatch_window="Rerouted Discharge",
        ocean_freight_usd=alt_port_eval.ocean_freight_total_usd,
        bunker_cost_usd=alt_port_eval.bunker_cost_usd,
        demurrage_risk_usd=alt_port_eval.estimated_demurrage_usd,
        lighterage_usd=alt_port_eval.lighterage_cost_usd,
        total_landed_cost_usd=alt_port_eval.total_landed_cost_usd,
        cost_per_mt_usd=alt_port_eval.landed_cost_per_mt_usd,
        cost_variance_vs_base_usd=s3_var,
        feasibility_status="FEASIBLE" if alt_port_eval.is_compatible else "RESTRICTED",
        risk_rating="LOW" if s3_var < 0 else "MEDIUM"
    ))

    # Scenario 4: Bunker & Waiting Time Stress Test (+15% fuel, +3 days delay)
    stress_bunker = round(base_vessel_eval.bunker_cost_usd * 1.15, 2)
    stress_demurrage = round(base_vessel_eval.estimated_demurrage_usd + (3.0 * 25000.0), 2)
    stress_total = round(base_vessel_eval.ocean_freight_total_usd + stress_bunker + base_vessel_eval.port_charges_usd + base_vessel_eval.lighterage_cost_usd + stress_demurrage, 2)
    s4_var = round(stress_total - base_total, 2)
    scenarios.append(ScenarioOption(
        scenario_id="SCENARIO_STRESS_TEST",
        scenario_name="Stress-Test: +15% VLSFO Bunker Surge & +3 Days Port Queue Delay",
        vessel_class=req.baseline_vessel,
        destination_port=req.baseline_dest,
        dispatch_window="Severe Weather / Queue",
        ocean_freight_usd=base_vessel_eval.ocean_freight_total_usd,
        bunker_cost_usd=stress_bunker,
        demurrage_risk_usd=stress_demurrage,
        lighterage_usd=base_vessel_eval.lighterage_cost_usd,
        total_landed_cost_usd=stress_total,
        cost_per_mt_usd=round(stress_total / req.baseline_cargo_mt, 2),
        cost_variance_vs_base_usd=s4_var,
        feasibility_status="FEASIBLE",
        risk_rating="HIGH"
    ))

    insights = [
        f"Baseline landed cost is ${base_per_mt:.2f}/MT (${base_total:,.2f} total expenditure).",
        f"Best simulated outcome: {min(scenarios, key=lambda s: s.total_landed_cost_usd).scenario_name} with savings potential.",
        "Port diversion to deep-draft terminals (Dhamra/Gangavaram) substantially reduces lighterage and pre-berthing wait.",
        "Every +1 day of pre-berthing wait on a Capesize incurs $32,000 demurrage penalty, exceeding freight route variations."
    ]

    return ScenarioSimulationResponse(
        baseline_summary={
            "cargo_mt": req.baseline_cargo_mt,
            "vessel": req.baseline_vessel,
            "origin": req.baseline_origin,
            "dest": req.baseline_dest,
            "base_landed_cost_usd": base_total,
            "base_cost_per_mt_usd": base_per_mt
        },
        scenarios=scenarios,
        key_insights=insights
    )
