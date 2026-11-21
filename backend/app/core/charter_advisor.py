"""
Smart charter recommendation engine answering:
- Charter immediately vs wait
- Estimated freight cost & expected savings delta
- Spot voyage vs Time-Charter contract evaluation
- Explainable AI factor decomposition
"""
from typing import Dict, List, Any
from app.ml.forecasting_engine import forecaster
from app.core.vessel_data import VESSEL_CLASSES
from app.models.schemas import (
    CharterDecisionRequest,
    CharterRecommendationResponse,
    FactorContribution
)

def generate_charter_recommendation(req: CharterDecisionRequest) -> CharterRecommendationResponse:
    # 1. Fetch multi-horizon forecast from ML engine
    forecast = forecaster.generate_forecast(
        vessel_class=req.vessel_class,
        horizon_days=req.target_arrival_days
    )

    current_spot = forecast["current_spot_rate_usd"]
    forecasted_30d = forecast["mean_forecast_rate"]
    pct_change = forecast["percentage_change_projected"]

    # 2. Decision Logic
    # Cost delta = (Forecasted - Current) * Quantity
    cost_delta = round((forecasted_30d - current_spot) * req.cargo_quantity_mt, 2)
    savings_pct = abs(pct_change)

    v_spec = VESSEL_CLASSES.get(req.vessel_class, VESSEL_CLASSES["Capesize"])
    daily_hire = v_spec["daily_hire_usd"]

    explainable_factors: List[FactorContribution] = []

    if pct_change >= 4.0:
        # Market expected to surge -> lock spot now or take short-term TC
        verdict = "ENTER_SPOT_NOW"
        headline = f"Strong Buy Signal: Spot rates for {req.vessel_class} projected to rise {pct_change:+.1f}% within {req.target_arrival_days} days."
        contract_type = "Spot Voyage Charter (Immediate Fixing)"
        confidence = "HIGH" if abs(pct_change) > 8.0 else "MEDIUM"
        actionable = (
            f"Fix vessel charter immediately on spot terms. Locking today's rate of ${current_spot:.2f}/MT avoids an "
            f"estimated ${cost_delta:,.2f} cost increase across your {req.cargo_quantity_mt:,.0f} MT parcel."
        )

        explainable_factors.append(FactorContribution(
            factor_name="Market Rate Momentum",
            impact="BULLISH",
            description="Upward pressure on Baltic index components and vessel demand along Pacific/Indian Ocean routes.",
            weight=0.45
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Bunker Fuel Volatility",
            impact="BULLISH",
            description="VLSFO pricing holding firm near $635/MT, exerting upward pressure on shipowners' voyage freight quotes.",
            weight=0.30
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Port Congestion Buffers",
            impact="BULLISH",
            description="Rising turnaround queues at East Coast discharge berths increasing turnaround days and carrier risk premia.",
            weight=0.25
        ))

    elif pct_change <= -4.0:
        # Market expected to soften -> wait for lower rates
        verdict = "DEFER_SPOT_BOOKING"
        headline = f"Hold & Defer Signal: Spot rates for {req.vessel_class} projected to soften by {abs(pct_change):.1f}% over the next {req.target_arrival_days} days."
        contract_type = "Spot Voyage Charter (Staggered / Delayed Entry)"
        confidence = "HIGH" if abs(pct_change) > 8.0 else "MEDIUM"
        actionable = (
            f"Postpone spot booking by 10–14 days. Waiting for market cooling is projected to yield savings of "
            f"approx ${abs(cost_delta):,.2f} (${abs(current_spot - forecasted_30d):.2f}/MT discount)."
        )

        explainable_factors.append(FactorContribution(
            factor_name="Seasonal Cargo Demand Lull",
            impact="BEARISH",
            description="Seasonal dip in steel mill raw material tenders and increased tonnage supply in the Bay of Bengal.",
            weight=0.50
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Tonnage Fleet Influx",
            impact="BEARISH",
            description="Ballasters clearing Far East discharge ports increasing prompt vessel availability for Indian routes.",
            weight=0.30
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Commodity Price Softening",
            impact="NEUTRAL",
            description="Coking coal index stabilizing, reducing charterers' urgency for panic fixtures.",
            weight=0.20
        ))

    else:
        # Market stable or volatile -> Consider Time Charter hedge
        verdict = "LOCK_SHORT_TERM_TC"
        headline = f"Neutral / Volatility Hedge: Spot market fluctuating within +/-{abs(pct_change):.1f}%. Consider Short-Term Time Charter."
        contract_type = "30-Day Time Charter (TC) / Index-Linked Contract"
        confidence = "MEDIUM"
        actionable = (
            f"Spot rates are range-bound around ${current_spot:.2f}/MT. Enter a 30-day Time Charter contract at approx "
            f"${daily_hire:,.0f}/day to hedge against sudden weather or port congestion demurrage spikes."
        )

        explainable_factors.append(FactorContribution(
            factor_name="Range-Bound Spot Volatility",
            impact="NEUTRAL",
            description="Neither clear bullish nor bearish breakout detected across forward freight indicators.",
            weight=0.40
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Operational Demurrage Protection",
            impact="BULLISH",
            description="Time Charter shields procurement teams from demurrage rate penalties during East Coast berth bunching.",
            weight=0.35
        ))
        explainable_factors.append(FactorContribution(
            factor_name="Predictable Landed Budgeting",
            impact="NEUTRAL",
            description="Fixing daily hire ensures stable cost allocation for SAIL blast furnace raw material inventory.",
            weight=0.25
        ))

    return CharterRecommendationResponse(
        verdict=verdict,
        headline=headline,
        confidence_level=confidence,
        current_spot_rate_usd=round(current_spot, 2),
        forecasted_rate_usd_30d=round(forecasted_30d, 2),
        expected_cost_delta_usd=cost_delta,
        expected_savings_percentage=savings_pct,
        recommended_contract_type=contract_type,
        explainable_factors=explainable_factors,
        actionable_takeaway=actionable
    )
