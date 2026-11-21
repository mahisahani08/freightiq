# FreightIQ – Intelligent Maritime Freight Forecasting & Bulk Chartering Decision Support Platform

**Enterprise Logistics & AI Decision Support System**  
**Organization:** Ministry of Steel • Steel Authority of India Limited (SAIL)  
**Domain:** Transportation, Maritime Navigation & Industrial Raw Material Procurement  

---

## 1. Executive Summary

Steel Authority of India Limited (SAIL) imports millions of metric tonnes of metallurgical coking coal and fluxes annually from Australia (Hay Point, Gladstone), the United States (Hampton Roads), Mozambique (Maputo), Russia, and Indonesia to blast furnaces across eastern India (Bhilai, Bokaro, Rourkela, Durgapur, IISCO Burnpur).

Current chartering operations rely heavily on daily market inquiries, manual broker evaluations, and historical heuristics. This creates significant risks:
1. **Market Timing Uncertainty:** Lack of forward rate forecasting leads to chartering during peak fixtures.
2. **Navigational Grounding & Draft Risks:** Heavy Capesize bulkers (18.2m draft) face severe draft limits at Indian East Coast ports, especially riverine sandbars at Haldia (8.5m draft limit).
3. **Severe Demurrage Liabilities:** Berth congestion and pre-berthing wait times (2 to 5 days) burn between **$14,000 and $32,000/day** in demurrage.

**FreightIQ** resolves these challenges by integrating **supervised time-series rate forecasting (XGBoost & Random Forest)**, an **Explainable AI charter timing arbitrator (Spot vs. Time-Charter)**, a **physical port navigational gatekeeper**, and an **idle-time queuing simulator**.

---

## 2. Core Functional Modules

### Module 1: Intelligent Freight Forecasting Engine
* Multi-horizon forward predictions (7, 14, 30, 60 days) across **Handysize, Supramax, Panamax, and Capesize** bulk carriers.
* Supervised feature engineering integrating Baltic Capesize Index (BCI), Singapore VLSFO 0.5% bunker fuel prices, commodity indices, monsoon/cyclone seasonality, and lag dynamics.
* Dynamic Gaussian uncertainty bands providing **80% and 95% confidence intervals**.

### Module 2: Smart Chartering Decision Advisor
* Arbitrage decision engine answering: **Fix Spot Promptly vs. Defer Tender vs. Lock Short-Term Time Charter (TC)**.
* Financial delta modeling estimating monetary gain/loss across laycan arrival windows.
* Explainable AI (XAI) feature attribution breakdown with percentage weight contributions.

### Module 3: Vessel & Landed-Cost Optimization Engine
* Complete landed-cost breakdown per metric tonne:
  $$\text{Landed Cost (\$/MT)} = \text{Ocean Freight} + \text{Bunker Fuel} + \text{Port Dues} + \text{Demurrage Liability} + \text{Offshore Lighterage}$$
* Dynamic physical constraints checking: Deadweight tonnage (DWT), draft, Length Overall (LOA), beam, and berth handling rates.

### Module 4: East Coast Port Intelligence Gatekeeper
* Verified parameters for 7 major Indian East Coast ports:
  * **Paradip Port** (14.5m draft, CQ1/CQ2 mechanization, 45,000 TPD rail rake link to RSP & BSL)
  * **Dhamra Port** (18.5m deepwater draft, Adani mechanized Capesize berths, 60,000 TPD rail link)
  * **Visakhapatnam Port** (16.5m outer harbor draft, direct rail link to Bhilai Steel Plant)
  * **Gangavaram Port** (19.0m super-deepwater Capesize coal berths, 55,000 TPD rail link to BSP)
  * **Gopalpur Port** (12.5m draft, Panamax bulk handling)
  * **Haldia Dock Complex** (8.5m draft riverine lock gate, mandatory Sagar Sandheads lightering for Capesize/Panamax, servicing DSP & ISP)
  * **Sagar / Sandheads Anchorage** (20.0m deepwater anchorage for offshore barge lightering)

### Module 5: Vessel Idle-Time & Demurrage Analyzer
* $M/M/c$ queuing simulation estimating anchorage waiting hours, pre-berthing queues, and turnaround duration.
* Financial exposure calculation based on daily demurrage hire rates ($14,000–$32,000/day).
* Alternative port diversion arbitrage identifying potential demurrage savings.

### Module 6: Risk Intelligence & What-If Scenario Sandbox
* Composite risk index (0–100) evaluating freight volatility, port congestion, weather threats, and bunker fuel shocks.
* Interactive What-If simulation comparing baseline against deferred booking, vessel resizing, port diversions, and fuel price volatility.

---

## 3. Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Recharts, Lucide React Icons.
* **Backend:** Python 3.12, FastAPI, Uvicorn, Pydantic v2.
* **Machine Learning:** Scikit-Learn, XGBoost, Pandas, NumPy, Statsmodels.
* **Database:** Relational SQLite (WAL mode) with audit logging; schema ready for PostgreSQL.

---

## 4. Local Execution & Quickstart

### Prerequisites
* Python 3.10+
* Node.js 18+

### 1. Backend Server Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
* Production Web UI: `http://127.0.0.1:8000/`

### 2. Frontend Development Server Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
* Frontend Live URL: `http://127.0.0.1:5173/`

### 3. Run Automated Tests
```bash
cd backend
python -m unittest tests/test_all_engines.py
```

---

## 5. Economic & Strategic Impact for SAIL

1. **Ocean Freight Cost Savings:**
   Timing coking coal shipments during softening forward rate windows ($0.70–$1.50/MT projected drop) yields net savings of **$105,000 to $225,000 per Capesize fixture** (150,000 MT parcel).
2. **Demurrage Avoidance:**
   Proactive diversion from congested Haldia/Paradip berths to deepwater Gangavaram/Dhamra eliminates 3–5 days of pre-berthing wait, avoiding **$96,000 to $160,000 in demurrage liabilities**.
3. **Safe Navigational Gatekeeping:**
   Guarantees that large bulk carriers never breach port draft restrictions in the Hooghly estuary by enforcing automated Sandheads lighterage protocol.
