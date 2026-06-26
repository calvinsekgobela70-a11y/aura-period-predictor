import React from 'react';
import { motion } from 'motion/react';
import { CycleData } from '../types';
import { Bell, Shield, User, Trash2, Heart } from 'lucide-react';
import { ReproductiveSystemIcon } from '../components/ReproductiveSystemIcon';

interface SettingsViewProps {
  settings: CycleData['settings'];
  updateSettings: (s: Partial<CycleData['settings']>) => void;
}

export function SettingsView({ settings, updateSettings }: SettingsViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col pt-8 pb-32 px-6 min-h-screen"
    >
      <header className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
          <ReproductiveSystemIcon color="white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">Settings</h2>
          <p className="text-gray-400 font-medium">Personalize Aura</p>
        </div>
      </header>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-2">
            <User size={16} /> Cycle Defaults
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">Average Cycle Length</label>
                <span className="text-blue-500 font-bold bg-blue-50 px-3 py-1 rounded-2xl text-sm">{settings.averageCycleLength} days</span>
              </div>
              <input 
                type="range" 
                min="20" max="45" 
                value={settings.averageCycleLength}
                onChange={(e) => updateSettings({ averageCycleLength: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-pink-50">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">Average Period Length</label>
                <span className="text-purple-500 font-bold bg-purple-50 px-3 py-1 rounded-2xl text-sm">{settings.averagePeriodLength} days</span>
              </div>
              <input 
                type="range" 
                min="2" max="10" 
                value={settings.averagePeriodLength}
                onChange={(e) => updateSettings({ averagePeriodLength: parseInt(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-2">
            <Heart size={16} /> Health Goals
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">Daily Water Goal</label>
                <span className="text-cyan-500 font-bold bg-cyan-50 px-3 py-1 rounded-2xl text-sm">{settings.waterGoal} ml</span>
              </div>
              <input 
                type="range" 
                min="500" max="5000" step="100"
                value={settings.waterGoal || 2000}
                onChange={(e) => updateSettings({ waterGoal: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="pt-4 border-t border-pink-50">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">Daily Sleep Goal</label>
                <span className="text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-2xl text-sm">{settings.sleepGoal} hrs</span>
              </div>
              <input 
                type="range" 
                min="4" max="12" step="0.5"
                value={settings.sleepGoal || 8}
                onChange={(e) => updateSettings({ sleepGoal: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-6 flex items-center gap-2">
            <Bell size={16} /> Notifications
          </h3>
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="font-semibold text-gray-700">Period Reminders</p>
              <p className="text-sm text-gray-400">2 days before expected date</p>
            </div>
            <div className="w-12 h-6 bg-[#FF6B9D] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </section>

        <section className="bg-rose-50 p-6 rounded-[32px] border border-rose-100 mt-8">
           <h3 className="text-xs font-black text-rose-400 uppercase tracking-tighter mb-4 flex items-center gap-2">
            <Shield size={16} /> Data & Privacy
          </h3>
          <p className="text-sm text-rose-800/70 mb-4 font-medium">All your data is stored locally on this device. We cannot access your health information.</p>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure? This will delete all logged data forever.")) {
                localStorage.removeItem('aura_cycle_data');
                window.location.reload();
              }
            }}
            className="w-full py-3 bg-white text-rose-500 font-bold rounded-2xl border border-rose-200 flex items-center justify-center gap-2 hover:bg-rose-100 transition shadow-sm"
          >
            <Trash2 size={18} /> Clear All Data
          </button>
        </section>
      </div>
    </motion.div>
  );
}
