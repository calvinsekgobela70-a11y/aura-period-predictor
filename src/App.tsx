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
            userName={data.settings.userName}
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
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-pink-200 selection:text-pink-900 text-[#4A4A4A] flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-[400px] h-[800px] max-h-[90vh] bg-black rounded-[50px] sm:rounded-[60px] shadow-2xl overflow-hidden ring-[10px] sm:ring-[14px] ring-black border-[4px] sm:border-[8px] border-[#2a2a35]">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 sm:h-7 flex justify-center z-50">
           <div className="w-24 sm:w-32 h-6 sm:h-7 bg-black rounded-b-2xl sm:rounded-b-3xl flex items-center justify-center gap-2">
              <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-900 rounded-full border border-gray-800"></div>
           </div>
        </div>
        <main className="w-full h-full relative bg-[#FFF5F7] flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
          <Navigation currentView={currentView} onChange={setCurrentView} />
        </main>
      </div>
    </div>
  );
}
