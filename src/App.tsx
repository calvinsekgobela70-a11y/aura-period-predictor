import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useCycleData } from './hooks/useCycleData';
import { Navigation } from './components/Navigation';
import { HomeView } from './views/HomeView';
import { CalendarView } from './views/CalendarView';
import { LogView } from './views/LogView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';
import { ViewState } from './types';
import { getTodayStr } from './lib/utils';

export default function App() {
  const { 
    data, 
    loaded, 
    updateSettings, 
    addPeriod, 
    endCurrentPeriod, 
    updateSymptom, 
    getLatestPeriod 
  } = useCycleData();
  
  const [currentView, setCurrentView] = useState<ViewState>('home');

  if (!loaded) return null; // Wait for localStorage

  const handleLogFlow = () => {
    const latest = getLatestPeriod();
    const today = getTodayStr();
    
    if (latest && latest.endDate === null) {
      endCurrentPeriod(today);
    } else {
      addPeriod(today);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            key="home" 
            latestPeriod={getLatestPeriod()} 
            cycleLength={data.settings.averageCycleLength}
            periodLength={data.settings.averagePeriodLength}
            onLogFlow={handleLogFlow}
          />
        );
      case 'calendar':
        return <CalendarView key="calendar" data={data} />;
      case 'log':
        return (
          <LogView 
            key="log" 
            currentLog={data.symptoms[getTodayStr()]} 
            onSave={updateSymptom} 
          />
        );
      case 'insights':
        return <InsightsView key="insights" data={data} />;
      case 'settings':
        return <SettingsView key="settings" settings={data.settings} updateSettings={updateSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans selection:bg-pink-200 selection:text-pink-900 text-[#4A4A4A] overflow-x-hidden">
      <main className="max-w-md mx-auto relative bg-[#FFF5F7] min-h-screen shadow-2xl border-x border-pink-50 flex flex-col">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
        <Navigation currentView={currentView} onChange={setCurrentView} />
      </main>
    </div>
  );
}
