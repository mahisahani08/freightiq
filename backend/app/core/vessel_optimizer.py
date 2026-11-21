"""
Vessel selection, physical port compatibility gatekeeper, and landed cost optimization engine.
"""
from typing import Dict, List, Any
import math

from app.core.port_data import EAST_COAST_PORTS, LOADING_ORIGINS, get_route_distance
from app.core.vessel_data import VESSEL_CLASSES
from app.ml.forecasting_engine import forecaster
from app.models.schemas import CargoRequest, VesselEvaluationResult, VesselOptimizationResponse

def evaluate_vessel_options(cargo_req: CargoRequest) -> VesselOptimizationResponse:
    dest_port_data = EAST_COAST_PORTS.get(cargo_req.destination_port)
    if not dest_port_data:
        raise ValueError(f"Destination port '{cargo_req.destination_port}' not found in East Coast database.")

    distance_nm = get_route_distance(cargo_req.origin_country, cargo_req.destination_port)
    bunker_price_usd = 635.0  # Current benchmark VLSFO $/MT

    evaluated_vessels: List[VesselEvaluationResult] = []

    for v_class, v_spec in VESSEL_CLASSES.items():
        reasons: List[str] = []
        is_compatible = True
        compatibility_score = 100.0

        # Physical Constraints Checks
        # 1. Draft check
        max_port_draft = dest_port_data["max_draft_m"]
        vessel_draft = v_spec["typical_draft_m"]
        requires_lightering = False

        if vessel_draft > max_port_draft:
            if cargo_req.destination_port == "Haldia":
                requires_lightering = True
                reasons.append(
                    f"Vessel draft ({vessel_draft}m) exceeds Haldia riverine maximum ({max_port_draft}m). "
                    f"Direct dock berthing prohibited. Requires mandatory offshore lighterage at Sagar/Sandheads."
                )
                compatibility_score -= 35.0
            else:
                is_compatible = False
                reasons.append(
                    f"Physical Draft Incompatibility: Vessel draft ({vessel_draft}m) exceeds port permissible limit ({max_port_draft}m)."
                )
                compatibility_score -= 60.0

        # 2. LOA check
        max_port_loa = dest_port_data["max_loa_m"]
        vessel_loa = v_spec["typical_loa_m"]
        if vessel_loa > max_port_loa:
            is_compatible = False
            reasons.append(
                f"Physical LOA Incompatibility: Vessel length ({vessel_loa}m) exceeds port basin length ({max_port_loa}m)."
            )
            compatibility_score -= 30.0

        # 3. Beam check
        max_port_beam = dest_port_data["max_beam_m"]
        vessel_beam = v_spec["typical_beam_m"]
        if vessel_beam > max_port_beam:
            is_compatible = False
            reasons.append(
                f"Physical Beam Incompatibility: Vessel beam ({vessel_beam}m) exceeds entrance channel/lock gate width ({max_port_beam}m)."
            )
            compatibility_score -= 25.0

        # 4. Parcel Size & DWT feasibility
        # How many voyages / parcels needed to lift total cargo
        v_dwt = v_spec["typical_dwt"]
        parcels = max(1, math.ceil(cargo_req.cargo_quantity_mt / v_dwt))
        cargo_per_vessel = min(cargo_req.cargo_quantity_mt, float(v_dwt))

        # If cargo is small (e.g. 35,000 MT) and vessel is Capesize (175,000 DWT), deadfreight penalty
        if cargo_req.cargo_quantity_mt < v_spec["dwt_min"]:
            compatibility_score -= 40.0
            reasons.append(
                f"Sub-optimal parcel sizing: Cargo ({cargo_req.cargo_quantity_mt:,.0f} MT) is under minimum vessel deadweight ({v_spec['dwt_min']:,} DWT). Incurs deadfreight."
            )

        # Operational Voyage Calculations
        steaming_speed = v_spec["speed_laden_knots"]
        steaming_hours = distance_nm / steaming_speed
        steaming_days = round(steaming_hours / 24.0, 1)

        # Discharge time based on port mechanized berth rates
        best_berth_rate = max([b["discharge_rate_tpd"] for b in dest_port_data["berths"]])
        discharge_days = round(cargo_per_vessel / best_berth_rate, 1)
        waiting_days = dest_port_data["typical_waiting_days"]
        total_voyage_days = round(steaming_days + discharge_days + waiting_days, 1)

        # Costing calculations
        # Get ML spot rate prediction for this vessel class
        forecast_res = forecaster.generate_forecast(vessel_class=v_class, horizon_days=14)
        spot_rate_usd_mt = forecast_res["current_spot_rate_usd"]

        ocean_freight_total = round(spot_rate_usd_mt * cargo_req.cargo_quantity_mt, 2)
        bunker_consumption_total_t = (steaming_days * v_spec["bunker_consumption_tpd"]) * parcels
        bunker_cost_usd = round(bunker_consumption_total_t * bunker_price_usd, 2)
        port_charges_usd = round(v_spec["port_dues_per_call_usd"] * parcels, 2)

        lighterage_cost_usd = 0.0
        if requires_lightering:
            lighterage_cost_usd = round(cargo_req.cargo_quantity_mt * 4.85, 2)

        # Demurrage estimate: expected waiting days * daily demurrage rate
        demurrage_usd = round(waiting_days * v_spec["demurrage_rate_per_day_usd"] * parcels, 2)

        total_landed_cost = round(
            ocean_freight_total + bunker_cost_usd + port_charges_usd + lighterage_cost_usd + demurrage_usd, 2
        )
        landed_cost_per_mt = round(total_landed_cost / cargo_req.cargo_quantity_mt, 2)

        # Verdict assignment
        if not is_compatible:
            verdict = "PHYSICALLY_REJECTED"
            score = 0.0
        elif requires_lightering:
            verdict = "FEASIBLE"
            score = max(30.0, compatibility_score)
        elif compatibility_score >= 80.0:
            verdict = "OPTIMAL"
            score = compatibility_score
        else:
            verdict = "FEASIBLE"
            score = compatibility_score

        evaluated_vessels.append(
            VesselEvaluationResult(
                vessel_class=v_class,
                is_compatible=is_compatible or requires_lightering,
                rejection_reasons=reasons,
                compatibility_score=round(score, 1),
                parcels_required=parcels,
                cargo_per_vessel_mt=cargo_per_vessel,
                ocean_freight_rate_usd_per_mt=round(spot_rate_usd_mt, 2),
                ocean_freight_total_usd=ocean_freight_total,
                bunker_cost_usd=bunker_cost_usd,
                port_charges_usd=port_charges_usd,
                lighterage_cost_usd=lighterage_cost_usd,
                estimated_demurrage_usd=demurrage_usd,
                total_landed_cost_usd=total_landed_cost,
                landed_cost_per_mt_usd=landed_cost_per_mt,
                steaming_days=steaming_days,
                waiting_days=waiting_days,
                discharge_days=discharge_days,
                total_voyage_days=total_voyage_days,
                rank=99,
                recommendation_verdict=verdict
            )
        )

    # Rank compatible vessels by landed cost per MT
    compatible_list = [v for v in evaluated_vessels if v.is_compatible]
    compatible_list.sort(key=lambda x: x.landed_cost_per_mt_usd)

    for idx, v in enumerate(compatible_list):
        v.rank = idx + 1
        if idx == 0:
            v.recommendation_verdict = "OPTIMAL"

    optimal_class = compatible_list[0].vessel_class if compatible_list else None

    # Summary rationale
    if optimal_class:
        best_v = compatible_list[0]
        summary = (
            f"Recommended Vessel: {optimal_class} at total landed cost of ${best_v.landed_cost_per_mt_usd:.2f}/MT "
            f"(${best_v.total_landed_cost_usd:,.2f} total). "
            f"Total voyage duration estimated at {best_v.total_voyage_days} days (including {best_v.waiting_days} days pre-berthing wait). "
            f"Physical restrictions verified for {cargo_req.destination_port}."
        )
    else:
        summary = f"No standard vessel class directly satisfies physical constraints of {cargo_req.destination_port} for this cargo parcel."

    return VesselOptimizationResponse(
        cargo_request=cargo_req,
        route_distance_nm=distance_nm,
        evaluated_vessels=evaluated_vessels,
        optimal_vessel_class=optimal_class,
        optimization_summary=summary
    )
