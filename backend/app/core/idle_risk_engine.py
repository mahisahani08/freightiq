"""
Vessel idle-time queuing analysis, demurrage financial exposure, and multi-factor risk monitoring.
"""
from typing import Dict, List, Any
from app.core.port_data import EAST_COAST_PORTS
from app.core.vessel_data import VESSEL_CLASSES
from app.models.schemas import IdleTimeRequest, IdleTimeResponse, RiskAssessmentResponse

def calculate_idle_and_demurrage(req: IdleTimeRequest) -> IdleTimeResponse:
    port = EAST_COAST_PORTS.get(req.port_name)
    if not port:
        raise ValueError(f"Port '{req.port_name}' not found.")

    v_spec = VESSEL_CLASSES.get(req.vessel_class, VESSEL_CLASSES["Capesize"])

    # Port operational metrics
    waiting_days = port["typical_waiting_days"]
    waiting_hours = waiting_days * 24.0

    # Discharge calculation
    best_rate = max([b["discharge_rate_tpd"] for b in port["berths"]])
    discharge_days = round(req.cargo_quantity_mt / best_rate, 1)
    discharge_hours = discharge_days * 24.0
    turnaround_days = round(waiting_days + discharge_days, 1)

    # Demurrage financial exposure:
    # Standard charterparty provides laytime allowance (e.g. 3.0 days). Delay beyond laytime = demurrage.
    laytime_allowed_days = max(2.5, discharge_days + 0.5)
    demurrage_days = max(0.0, turnaround_days - laytime_allowed_days)
    daily_demurrage = v_spec["demurrage_rate_per_day_usd"]
    demurrage_exposure_usd = round(demurrage_days * daily_demurrage, 2)

    # Congestion level classification
    if waiting_days > 4.0:
        congestion_level = "CRITICAL"
        queue_vessels = 11
        occupancy = 0.94
    elif waiting_days > 2.5:
        congestion_level = "HIGH"
        queue_vessels = 7
        occupancy = 0.85
    elif waiting_days > 1.8:
        congestion_level = "MODERATE"
        queue_vessels = 4
        occupancy = 0.72
    else:
        congestion_level = "LOW"
        queue_vessels = 2
        occupancy = 0.58

    mitigations = [
        "Request priority berthing under long-term SAIL volume offtake agreement.",
        "Pre-stage railway rakes at port siding 48 hours prior to vessel arrival.",
        f"Consider twin-crane discharge or high-capacity grab unloaders (target >{best_rate:,.0f} TPD)."
    ]

    # Alternative feasible East Coast ports
    alternatives = []
    for p_name, p_data in EAST_COAST_PORTS.items():
        if p_name != req.port_name and p_data["max_draft_m"] >= v_spec["typical_draft_m"] and p_name != "Sagar-Sandheads":
            alternatives.append({
                "port_name": p_name,
                "waiting_days": p_data["typical_waiting_days"],
                "draft_m": p_data["max_draft_m"],
                "rail_connectivity": p_data["rail_connectivity"],
                "potential_idle_savings_usd": round(max(0.0, (waiting_days - p_data["typical_waiting_days"])) * daily_demurrage, 2)
            })

    return IdleTimeResponse(
        port_name=req.port_name,
        vessel_class=req.vessel_class,
        current_queue_vessels=queue_vessels,
        berth_occupancy_rate=occupancy,
        estimated_waiting_hours=waiting_hours,
        estimated_waiting_days=waiting_days,
        estimated_discharge_hours=discharge_hours,
        estimated_discharge_days=discharge_days,
        total_turnaround_days=turnaround_days,
        demurrage_exposure_usd=demurrage_exposure_usd,
        congestion_level=congestion_level,
        mitigation_options=mitigations,
        alternative_ports_suggested=alternatives
    )

def evaluate_risk_profile() -> RiskAssessmentResponse:
    """Evaluates multi-factor maritime freight and supply chain risks."""
    risk_breakdown = {
        "market_volatility": {
            "score": 64.0,
            "category": "MEDIUM",
            "description": "Baltic Dry sub-indices experiencing moderate 30-day oscillation due to raw material trade dynamics.",
            "metrics": "30-Day Rate Standard Deviation: ±$2.85/MT"
        },
        "port_congestion": {
            "score": 72.0,
            "category": "HIGH",
            "description": "Berth occupancy running above 85% at Haldia and Paradip with pre-berthing queues averaging 3.5 days.",
            "metrics": "Peak demurrage exposure: $32,000/day for Capesize"
        },
        "weather_seasonality": {
            "score": 42.0,
            "category": "LOW",
            "description": "Dry northeast monsoon corridor; favorable sea states in Bay of Bengal with minimal sea swell delay.",
            "metrics": "Monsoon Factor: OFF, Cyclone Alert Level: GREEN"
        },
        "bunker_fuel_cost": {
            "score": 58.0,
            "category": "MEDIUM",
            "description": "Singapore VLSFO benchmark trading stably at $635/MT with low refining crack spread volatility.",
            "metrics": "BAF sensitivity: $0.15/MT per $10 crude shift"
        },
        "geopolitical_chokepoints": {
            "score": 52.0,
            "category": "MEDIUM",
            "description": "Suez rerouting adds steaming days for US/European coal; Malacca & Sunda straits open with normal transit times.",
            "metrics": "US East Coast via Cape of Good Hope: +10 steaming days"
        }
    }

    avg_score = sum(r["score"] for r in risk_breakdown.values()) / len(risk_breakdown)
    overall_cat = "HIGH" if avg_score >= 70 else ("MEDIUM" if avg_score >= 45 else "LOW")

    alerts = [
        "Port Alert: Haldia lock gate maintenance scheduled; anticipate +1.5 days additional pre-berthing wait.",
        "Fleet Alert: Capesize tonnage tight in Singapore-Bay of Bengal ballast leg; spot prompts commanding $1,200/day premium.",
        "Logistics Alert: SE Railway rake availability at Paradip increased by 8 rakes/day, accelerating evacuation."
    ]

    return RiskAssessmentResponse(
        overall_risk_score=round(avg_score, 1),
        overall_risk_category=overall_cat,
        risk_breakdown=risk_breakdown,
        active_alerts=alerts,
        historical_volatility_30d_pct=14.2,
        bunker_fuel_trend="STABLE_SIDEWAYS"
    )
