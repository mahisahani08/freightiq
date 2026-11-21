"""
Vessel specifications, operational metrics, and charter baselines.
"""
from typing import Dict, Any

VESSEL_CLASSES: Dict[str, Dict[str, Any]] = {
    "Handysize": {
        "vessel_class": "Handysize",
        "dwt_min": 15000,
        "dwt_max": 39999,
        "typical_dwt": 32000,
        "typical_draft_m": 10.2,
        "typical_loa_m": 180.0,
        "typical_beam_m": 28.5,
        "daily_hire_usd": 12500.0,
        "bunker_consumption_tpd": 20.0,
        "demurrage_rate_per_day_usd": 14000.0,
        "speed_laden_knots": 13.0,
        "port_dues_per_call_usd": 38000.0,
        "description": "Geared bulk carriers suited for draft-restricted ports (Haldia with high tide / lightering)."
    },
    "Supramax": {
        "vessel_class": "Supramax",
        "dwt_min": 40000,
        "dwt_max": 64999,
        "typical_dwt": 58000,
        "typical_draft_m": 12.8,
        "typical_loa_m": 190.0,
        "typical_beam_m": 32.2,
        "daily_hire_usd": 16200.0,
        "bunker_consumption_tpd": 26.0,
        "demurrage_rate_per_day_usd": 18500.0,
        "speed_laden_knots": 13.5,
        "port_dues_per_call_usd": 55000.0,
        "description": "Workhorse flexible bulkers with onboard cranes. Ideal for Gopalpur and intermediate parcels."
    },
    "Panamax": {
        "vessel_class": "Panamax",
        "dwt_min": 65000,
        "dwt_max": 84999,
        "typical_dwt": 75000,
        "typical_draft_m": 14.4,
        "typical_loa_m": 225.0,
        "typical_beam_m": 32.3,
        "daily_hire_usd": 20500.0,
        "bunker_consumption_tpd": 32.0,
        "demurrage_rate_per_day_usd": 22500.0,
        "speed_laden_knots": 13.5,
        "port_dues_per_call_usd": 72000.0,
        "description": "Standard workhorse for Australian coking coal to Paradip, Vizag, and Gopalpur."
    },
    "Capesize": {
        "vessel_class": "Capesize",
        "dwt_min": 100000,
        "dwt_max": 200000,
        "typical_dwt": 175000,
        "typical_draft_m": 18.2,
        "typical_loa_m": 292.0,
        "typical_beam_m": 45.0,
        "daily_hire_usd": 28500.0,
        "bunker_consumption_tpd": 48.0,
        "demurrage_rate_per_day_usd": 32000.0,
        "speed_laden_knots": 14.0,
        "port_dues_per_call_usd": 120000.0,
        "description": "Ultra-large gearless bulkers delivering lowest freight per tonne. Requires deep-draft ports (Dhamra, Gangavaram, Vizag Outer)."
    }
}
