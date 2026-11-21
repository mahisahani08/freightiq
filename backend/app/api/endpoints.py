"""
FastAPI REST API routes for FreightIQ Maritime Decision Support System.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional

from app.core.port_data import EAST_COAST_PORTS, LOADING_ORIGINS
from app.core.vessel_data import VESSEL_CLASSES
from app.ml.forecasting_engine import forecaster
from app.core.vessel_optimizer import evaluate_vessel_options
from app.core.charter_advisor import generate_charter_recommendation
from app.core.idle_risk_engine import calculate_idle_and_demurrage, evaluate_risk_profile
from app.core.scenario_simulator import run_what_if_simulation
from app.core.database import log_decision, get_recent_decisions
from app.models.schemas import (
    ForecastRequest, ForecastResponse, ModelComparisonMetric,
    CargoRequest, VesselOptimizationResponse,
    CharterDecisionRequest, CharterRecommendationResponse,
    IdleTimeRequest, IdleTimeResponse,
    RiskAssessmentResponse,
    ScenarioSimulationRequest, ScenarioSimulationResponse
)

router = APIRouter(prefix="/api")

@router.get("/health")
def get_health_status():
    return {
        "status": "healthy",
        "system": "FreightIQ - Maritime Decision Support System",
        "organization": "Ministry of Steel (SAIL)",
        "ml_engine": "Operational",
        "models_available": ["Ridge Regression", "Random Forest", "XGBoost"],
        "database": "SQLite (Connected)"
    }

@router.get("/ports")
def get_ports_data():
    return {
        "east_coast_ports": EAST_COAST_PORTS,
        "loading_origins": LOADING_ORIGINS
    }

@router.get("/vessels")
def get_vessels_data():
    return VESSEL_CLASSES

@router.post("/forecast", response_model=ForecastResponse)
def get_forecast(req: ForecastRequest):
    try:
        res = forecaster.generate_forecast(
            vessel_class=req.vessel_class,
            route_id=req.route_id or "AUS_HAY_PARADIP",
            horizon_days=req.horizon_days
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models/performance", response_model=List[ModelComparisonMetric])
def get_models_performance(vessel_class: str = Query("Capesize")):
    try:
        metrics = forecaster.evaluate_all_models(vessel_class=vessel_class)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/vessels/optimize", response_model=VesselOptimizationResponse)
def optimize_vessel(req: CargoRequest):
    try:
        result = evaluate_vessel_options(req)
        # Log to DB
        if result.optimal_vessel_class:
            opt = next((v for v in result.evaluated_vessels if v.vessel_class == result.optimal_vessel_class), None)
            if opt:
                log_decision(
                    commodity=req.commodity_type,
                    qty=req.cargo_quantity_mt,
                    origin=f"{req.origin_country} - {req.origin_port}",
                    dest=req.destination_port,
                    vessel=result.optimal_vessel_class,
                    cost_per_mt=opt.landed_cost_per_mt_usd,
                    total_cost=opt.total_landed_cost_usd,
                    verdict=opt.recommendation_verdict,
                    summary=result.optimization_summary
                )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/charter/recommend", response_model=CharterRecommendationResponse)
def get_charter_recommendation(req: CharterDecisionRequest):
    try:
        return generate_charter_recommendation(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/idle/analyze", response_model=IdleTimeResponse)
def analyze_idle_time(req: IdleTimeRequest):
    try:
        return calculate_idle_and_demurrage(req)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/risk/profile", response_model=RiskAssessmentResponse)
def get_risk_profile():
    try:
        return evaluate_risk_profile()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scenarios/simulate", response_model=ScenarioSimulationResponse)
def simulate_scenario(req: ScenarioSimulationRequest):
    try:
        return run_what_if_simulation(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/decisions/history")
def get_history(limit: int = 20):
    try:
        return get_recent_decisions(limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
