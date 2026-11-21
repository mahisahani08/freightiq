"""
Generates statistically calibrated historical maritime freight datasets (2022 - 2026).
Calibrated against published Baltic Dry Index (BDI), BCI, BPI, and Singapore VLSFO ranges.
Explicitly tagged as [DEMO-CALIBRATED] to maintain full transparency.
"""
import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "historical_freight_rates.csv")

def generate_calibrated_dataset(force_regenerate: bool = False) -> str:
    """Generates and persists the historical freight rate dataset if not present."""
    os.makedirs(os.path.dirname(DATA_FILE_PATH), exist_ok=True)
    if os.path.exists(DATA_FILE_PATH) and not force_regenerate:
        return DATA_FILE_PATH

    np.random.seed(42)
    start_date = datetime(2022, 1, 1)
    end_date = datetime(2026, 11, 1)
    total_days = (end_date - start_date).days

    date_range = [start_date + timedelta(days=i) for i in range(0, total_days, 3)] # Every 3 days

    vessel_classes = {
        "Capesize": {
            "base_rate": 16.5,
            "volatility": 3.8,
            "bdi_factor": 1.4,
            "tce_base": 24000
        },
        "Panamax": {
            "base_rate": 19.0,
            "volatility": 3.1,
            "bdi_factor": 1.1,
            "tce_base": 18500
        },
        "Supramax": {
            "base_rate": 22.0,
            "volatility": 2.6,
            "bdi_factor": 0.9,
            "tce_base": 15000
        },
        "Handysize": {
            "base_rate": 25.5,
            "volatility": 2.2,
            "bdi_factor": 0.8,
            "tce_base": 12500
        }
    }

    routes = [
        ("Australia", "Hay Point", "Paradip", 4850),
        ("Australia", "Gladstone", "Visakhapatnam", 4720),
        ("Australia", "Hay Point", "Dhamra", 4890),
        ("Australia", "Hay Point", "Haldia", 4980),
        ("United States", "Hampton Roads", "Paradip", 11300),
        ("Mozambique", "Maputo", "Dhamra", 4290),
        ("Russia", "Taman", "Visakhapatnam", 5280),
        ("Indonesia", "Taboneo", "Gangavaram", 2290),
    ]

    records = []

    # Global macro trend simulation
    for d_idx, dt in enumerate(date_range):
        t_normalized = d_idx / len(date_range)
        day_of_year = dt.timetuple().tm_yday
        month = dt.month

        # Seasonal factors
        monsoon_dip = -1.8 if month in [6, 7, 8] else (0.8 if month in [10, 11] else 0.0)
        cyclone_bump = 1.5 if month in [1, 2, 3] else 0.0
        cny_dip = -1.2 if (month == 2 and dt.day < 20) else 0.0

        # Macro indicators
        bunker_vlsfo = 620.0 + 90.0 * np.sin(t_normalized * 8 * np.pi) + np.random.normal(0, 12)
        iron_ore_index = 115.0 + 20.0 * np.cos(t_normalized * 5 * np.pi) + np.random.normal(0, 4)
        coking_coal_index = 275.0 + 45.0 * np.sin(t_normalized * 4 * np.pi) + np.random.normal(0, 8)
        bdi_composite = 1800.0 + 600.0 * np.sin(t_normalized * 6 * np.pi) + (cyclone_bump * 150) + np.random.normal(0, 80)

        for v_name, v_cfg in vessel_classes.items():
            for origin_country, origin_port, dest_port, dist_nm in routes:
                route_id = f"{origin_country[:3].upper()}_{origin_port[:3].upper()}_{dest_port[:3].upper()}"
                
                # Distance scale factor (relative to 4800nm)
                dist_factor = dist_nm / 4800.0
                
                # Spot rate calculation ($/ton)
                bunker_influence = (bunker_vlsfo - 600.0) * 0.015
                market_noise = np.random.normal(0, v_cfg["volatility"] * 0.5)
                
                spot_rate = (
                    v_cfg["base_rate"] * dist_factor
                    + (bdi_composite - 1800.0) * 0.003 * v_cfg["bdi_factor"]
                    + bunker_influence
                    + monsoon_dip
                    + cyclone_bump
                    + cny_dip
                    + market_noise
                )
                spot_rate = max(round(spot_rate, 2), 6.5)

                tce = v_cfg["tce_base"] + (spot_rate - v_cfg["base_rate"]) * 750 + np.random.normal(0, 500)
                tce = max(round(tce, 0), 4500)

                congestion_days = round(max(1.0, 2.2 + 0.8 * np.sin(t_normalized * 12 * np.pi) + np.random.normal(0, 0.4)), 1)
                if dest_port == "Haldia":
                    congestion_days += 2.0

                records.append({
                    "date": dt.strftime("%Y-%m-%d"),
                    "vessel_class": v_name,
                    "route_id": route_id,
                    "origin_country": origin_country,
                    "origin_port": origin_port,
                    "destination_port": dest_port,
                    "distance_nm": dist_nm,
                    "spot_rate_usd_per_ton": spot_rate,
                    "time_charter_equivalent_usd": tce,
                    "bunker_vlsfo_price_usd": round(bunker_vlsfo, 2),
                    "iron_ore_price_index": round(iron_ore_index, 2),
                    "coking_coal_price_index": round(coking_coal_index, 2),
                    "bdi_sub_index": round(bdi_composite * v_cfg["bdi_factor"], 1),
                    "monsoon_season": 1 if month in [6, 7, 8, 9] else 0,
                    "cyclone_season": 1 if month in [1, 2, 3] else 0,
                    "port_congestion_days": congestion_days,
                    "is_synthetic_flag": True,
                    "data_source_label": "DEMO-CALIBRATED-BALTIC-PROXY"
                })

    df = pd.DataFrame(records)
    df.to_csv(DATA_FILE_PATH, index=False)
    print(f"Generated {len(df)} calibrated records in {DATA_FILE_PATH}")
    return DATA_FILE_PATH

if __name__ == "__main__":
    generate_calibrated_dataset(force_regenerate=True)
