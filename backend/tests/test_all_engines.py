"""
Unit and integration tests for FreightIQ decision support engines.
Run with: python -m unittest tests/test_all_engines.py
"""
import unittest
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ml.forecasting_engine import forecaster
from app.core.vessel_optimizer import evaluate_vessel_options
from app.core.charter_advisor import generate_charter_recommendation
from app.core.idle_risk_engine import calculate_idle_and_demurrage, evaluate_risk_profile
from app.core.scenario_simulator import run_what_if_simulation
from app.models.schemas import CargoRequest, CharterDecisionRequest, IdleTimeRequest, ScenarioSimulationRequest

class TestFreightIQEngines(unittest.TestCase):

    def test_01_ml_forecasting(self):
        """Test XGBoost/Ridge forecasting generation with confidence intervals."""
        res = forecaster.generate_forecast(vessel_class="Capesize", horizon_days=30)
        self.assertIn("predicted_rate_usd_per_ton", res["forecast_points"][0])
        self.assertGreater(res["current_spot_rate_usd"], 5.0)
        self.assertIn(res["market_opportunity_status"], ["FAVORABLE", "UNFAVORABLE", "NEUTRAL"])
        self.assertGreater(len(res["forecast_points"]), 5)

    def test_02_model_performance_evaluation(self):
        """Test model evaluation metrics across Ridge, RF, and XGBoost."""
        metrics = forecaster.evaluate_all_models(vessel_class="Capesize")
        self.assertGreaterEqual(len(metrics), 3)
        for m in metrics:
            self.assertIn("mae", m)
            self.assertIn("rmse", m)
            self.assertIn("r2_score", m)

    def test_03_physical_port_gatekeeper_haldia(self):
        """Test that deep-draft Capesize vessels are flagged with lighterage at Haldia."""
        cargo = CargoRequest(
            commodity_type="Coking Coal",
            cargo_quantity_mt=75000,
            origin_country="Australia",
            origin_port="Hay Point",
            destination_port="Haldia"
        )
        res = evaluate_vessel_options(cargo)
        capesize_eval = next(v for v in res.evaluated_vessels if v.vessel_class == "Capesize")
        # Should flag mandatory lighterage at Sandheads
        self.assertGreater(capesize_eval.lighterage_cost_usd, 0.0)
        self.assertTrue(any("Sandheads" in r for r in capesize_eval.rejection_reasons))

    def test_04_vessel_optimization_dhamra(self):
        """Test optimal vessel selection for deep-draft Dhamra port."""
        cargo = CargoRequest(
            commodity_type="Coking Coal",
            cargo_quantity_mt=150000,
            origin_country="Australia",
            origin_port="Hay Point",
            destination_port="Dhamra"
        )
        res = evaluate_vessel_options(cargo)
        # Capesize should be optimal for 150k MT to deep-draft Dhamra
        self.assertEqual(res.optimal_vessel_class, "Capesize")

    def test_05_charter_advisor(self):
        """Test charter recommendation decision logic."""
        req = CharterDecisionRequest(
            cargo_quantity_mt=75000,
            commodity_type="Coking Coal",
            origin_port="Hay Point",
            destination_port="Paradip",
            vessel_class="Capesize",
            target_arrival_days=30
        )
        rec = generate_charter_recommendation(req)
        self.assertIn(rec.verdict, ["ENTER_SPOT_NOW", "DEFER_SPOT_BOOKING", "LOCK_SHORT_TERM_TC"])
        self.assertGreater(len(rec.explainable_factors), 0)

    def test_06_idle_time_and_demurrage(self):
        """Test queuing analysis and demurrage calculation."""
        req = IdleTimeRequest(port_name="Paradip", vessel_class="Capesize", cargo_quantity_mt=80000)
        idle = calculate_idle_and_demurrage(req)
        self.assertGreater(idle.estimated_waiting_days, 0.0)
        self.assertGreater(idle.demurrage_exposure_usd, 0.0)

    def test_07_scenario_simulator(self):
        """Test what-if scenario comparison."""
        req = ScenarioSimulationRequest(
            baseline_cargo_mt=75000,
            baseline_vessel="Capesize",
            baseline_origin="Hay Point",
            baseline_dest="Paradip"
        )
        sim = run_what_if_simulation(req)
        self.assertGreaterEqual(len(sim.scenarios), 4)
        self.assertIn("baseline_summary", sim.__dict__)

if __name__ == "__main__":
    unittest.main()
