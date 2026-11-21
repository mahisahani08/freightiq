"""
SQLite database engine and table schemas for FreightIQ.
Structured for zero-dependency local execution, directly compatible with PostgreSQL migration.
"""
import os
import sqlite3
import json
from typing import Dict, List, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "freightiq.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Ports Master Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ports (
        port_id TEXT PRIMARY KEY,
        port_name TEXT NOT NULL,
        country TEXT NOT NULL,
        region TEXT NOT NULL,
        max_draft_m REAL NOT NULL,
        max_loa_m REAL NOT NULL,
        max_beam_m REAL NOT NULL,
        tidal_restriction INTEGER NOT NULL,
        requires_lighterage INTEGER NOT NULL,
        typical_waiting_days REAL NOT NULL,
        avg_turnaround_days REAL NOT NULL,
        railway_rake_capacity_tpd REAL NOT NULL,
        storage_capacity_mt REAL NOT NULL,
        verified_status TEXT NOT NULL,
        rail_connectivity TEXT NOT NULL
    );
    """)

    # Vessel Classes Master Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vessel_classes (
        vessel_class TEXT PRIMARY KEY,
        dwt_min INTEGER NOT NULL,
        dwt_max INTEGER NOT NULL,
        typical_dwt INTEGER NOT NULL,
        typical_draft_m REAL NOT NULL,
        typical_loa_m REAL NOT NULL,
        typical_beam_m REAL NOT NULL,
        daily_hire_usd REAL NOT NULL,
        bunker_consumption_tpd REAL NOT NULL,
        demurrage_rate_per_day_usd REAL NOT NULL,
        speed_laden_knots REAL NOT NULL,
        port_dues_per_call_usd REAL NOT NULL,
        description TEXT
    );
    """)

    # Query & Decision History Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decision_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        commodity_type TEXT,
        cargo_quantity_mt REAL,
        origin_port TEXT,
        destination_port TEXT,
        recommended_vessel TEXT,
        optimal_cost_per_mt REAL,
        total_landed_cost REAL,
        charter_verdict TEXT,
        decision_summary TEXT
    );
    """)

    conn.commit()
    conn.close()

def seed_db_if_empty():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if ports seeded
    cursor.execute("SELECT COUNT(*) FROM ports")
    if cursor.fetchone()[0] == 0:
        from app.core.port_data import EAST_COAST_PORTS
        from app.core.vessel_data import VESSEL_CLASSES

        for p_name, p in EAST_COAST_PORTS.items():
            cursor.execute("""
            INSERT INTO ports (
                port_id, port_name, country, region, max_draft_m, max_loa_m, max_beam_m,
                tidal_restriction, requires_lighterage, typical_waiting_days, avg_turnaround_days,
                railway_rake_capacity_tpd, storage_capacity_mt, verified_status, rail_connectivity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["port_id"], p["port_name"], p["country"], p["region"],
                p["max_draft_m"], p["max_loa_m"], p["max_beam_m"],
                1 if p["tidal_restriction"] else 0,
                1 if p["requires_lighterage"] else 0,
                p["typical_waiting_days"], p["avg_turnaround_days"],
                p["railway_rake_capacity_tpd"], p["storage_capacity_mt"],
                p["verified_status"], p["rail_connectivity"]
            ))

        for v_name, v in VESSEL_CLASSES.items():
            cursor.execute("""
            INSERT INTO vessel_classes (
                vessel_class, dwt_min, dwt_max, typical_dwt, typical_draft_m, typical_loa_m,
                typical_beam_m, daily_hire_usd, bunker_consumption_tpd, demurrage_rate_per_day_usd,
                speed_laden_knots, port_dues_per_call_usd, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                v["vessel_class"], v["dwt_min"], v["dwt_max"], v["typical_dwt"],
                v["typical_draft_m"], v["typical_loa_m"], v["typical_beam_m"],
                v["daily_hire_usd"], v["bunker_consumption_tpd"], v["demurrage_rate_per_day_usd"],
                v["speed_laden_knots"], v["port_dues_per_call_usd"], v["description"]
            ))

        conn.commit()
    conn.close()

def log_decision(
    commodity: str,
    qty: float,
    origin: str,
    dest: str,
    vessel: str,
    cost_per_mt: float,
    total_cost: float,
    verdict: str,
    summary: str
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO decision_logs (
        commodity_type, cargo_quantity_mt, origin_port, destination_port,
        recommended_vessel, optimal_cost_per_mt, total_landed_cost, charter_verdict, decision_summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (commodity, qty, origin, dest, vessel, cost_per_mt, total_cost, verdict, summary))
    conn.commit()
    conn.close()

def get_recent_decisions(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decision_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
