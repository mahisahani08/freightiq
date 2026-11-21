import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import OverviewView from './views/OverviewView';
import ForecastView from './views/ForecastView';
import VesselRecommendationView from './views/VesselRecommendationView';
import PortIntelligenceView from './views/PortIntelligenceView';
import CharterDecisionView from './views/CharterDecisionView';
import IdleTimeView from './views/IdleTimeView';
import RiskMonitoringView from './views/RiskMonitoringView';
import ScenarioSimulatorView from './views/ScenarioSimulatorView';
import ModelPerformanceView from './views/ModelPerformanceView';
import DataManagementView from './views/DataManagementView';
import AboutView from './views/AboutView';

const PAGE_TITLES = {
  overview: 'Executive Operations Dashboard',
  forecast: 'Freight Rate Forecasting Engine',
  vessel_opt: 'Vessel Selection & Port Optimization',
  ports: 'Port Infrastructure & Berthing Intelligence',
  charter: 'Chartering Decision Support',
  idle_time: 'Vessel Idle-Time & Demurrage Analysis',
  risk: 'Maritime Risk & Volatility Intelligence',
  simulator: 'What-If Scenario Simulator',
  models: 'Model Benchmark & Cross-Validation',
  data: 'Data Management & Decision Audit Logs',
  about: 'About Project (SIH26006 - SAIL)',
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  const renderActiveView = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewView setActivePage={setActivePage} />;
      case 'forecast':
        return <ForecastView />;
      case 'vessel_opt':
        return <VesselRecommendationView />;
      case 'ports':
        return <PortIntelligenceView />;
      case 'charter':
        return <CharterDecisionView />;
      case 'idle_time':
        return <IdleTimeView />;
      case 'risk':
        return <RiskMonitoringView />;
      case 'simulator':
        return <ScenarioSimulatorView />;
      case 'models':
        return <ModelPerformanceView />;
      case 'data':
        return <DataManagementView />;
      case 'about':
        return <AboutView />;
      default:
        return <OverviewView setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f1f5f9] text-slate-800 font-sans">
      {/* Deep Navy Corporate Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Corporate Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar activePageTitle={PAGE_TITLES[activePage] || 'FreightIQ'} />

        <main className="flex-1 overflow-y-auto p-5 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
