import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTodayStr, cn } from '../lib/utils';
import { Droplet, Frown, Smile, Heart, Zap, Thermometer, Moon, GlassWater, Pencil } from 'lucide-react';
import { SymptomLog } from '../types';

interface LogViewProps {
  currentLog: SymptomLog | undefined;
  onSave: (date: string, log: Partial<SymptomLog>) => void;
}

export function LogView({ currentLog, onSave }: LogViewProps) {
  const today = getTodayStr();
  
  const FLOW_LEVELS = [
    { id: 'spotting', label: 'Spotting', icon: Droplet, color: 'text-pink-300', bg: 'bg-pink-50', activeBg: 'bg-pink-100' },
    { id: 'light', label: 'Light', icon: Droplet, color: 'text-rose-400', bg: 'bg-rose-50', activeBg: 'bg-rose-100' },
    { id: 'medium', label: 'Medium', icon: Droplet, color: 'text-rose-500', bg: 'bg-rose-50', activeBg: 'bg-rose-100' },
    { id: 'heavy', label: 'Heavy', icon: Droplet, color: 'text-rose-700', bg: 'bg-rose-100', activeBg: 'bg-rose-200' },
  ];

  const SYMPTOMS = [
    { id: 'cramps', label: 'Cramps', icon: Zap },
    { id: 'headache', label: 'Headache', icon: Frown },
    { id: 'tender', label: 'Tender Breasts', icon: Heart },
    { id: 'fatigue', label: 'Fatigue', icon: Smile }, // Generic icon for simplicity
  ];

  const MOODS = ['Happy', 'Sad', 'Sensitive', 'Angry', 'Energetic', 'Calm'];
  
  const MUCUS_TYPES = [
    { id: 'dry', label: 'Dry' },
    { id: 'sticky', label: 'Sticky' },
    { id: 'creamy', label: 'Creamy' },
    { id: 'egg_white', label: 'Egg White' },
  ];

  const INTIMACY_TYPES = [
    { id: 'none', label: 'None' },
    { id: 'protected', label: 'Protected' },
    { id: 'unprotected', label: 'Unprotected' },
  ];

  const toggleSymptom = (id: string) => {
    const current = currentLog?.symptoms || [];
    const updated = current.includes(id) ? current.filter(s => s !== id) : [...current, id];
    onSave(today, { symptoms: updated });
  };

  const toggleMood = (id: string) => {
    const current = currentLog?.moods || [];
    const updated = current.includes(id) ? current.filter(s => s !== id) : [...current, id];
    onSave(today, { moods: updated });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col pt-8 pb-32 px-6 min-h-screen"
    >
      <header className="mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">Daily Log</h2>
        <p className="text-gray-400 font-medium">How are you feeling today?</p>
      </header>

      <div className="space-y-8">
        {/* Flow Selection */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Flow</h3>
          <div className="grid grid-cols-4 gap-3">
            {FLOW_LEVELS.map(level => {
              const isActive = currentLog?.flow === level.id;
              const Icon = level.icon;
              return (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSave(today, { flow: level.id as any })}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-[20px] transition-colors border",
                    isActive ? `border-transparent ${level.activeBg} shadow-inner` : `border-pink-50 ${level.bg} hover:border-pink-200`
                  )}
                >
                  <Icon className={cn("mb-2", level.color)} size={24} fill={isActive ? "currentColor" : "none"} />
                  <span className={cn("text-[10px] font-bold", isActive ? level.color : "text-gray-500")}>
                    {level.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Symptoms Selection */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Symptoms</h3>
          <div className="grid grid-cols-2 gap-3">
            {SYMPTOMS.map(symptom => {
              const isActive = (currentLog?.symptoms || []).includes(symptom.id);
              const Icon = symptom.icon;
              return (
                <motion.button
                  key={symptom.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-[20px] transition-all border text-left shadow-sm",
                    isActive 
                      ? "bg-[#FF6B9D] text-white border-[#FF6B9D] shadow-lg shadow-pink-200" 
                      : "bg-white text-gray-600 border-pink-50 hover:bg-rose-50"
                  )}
                >
                  <div className={cn("p-2 rounded-xl", isActive ? "bg-white/20" : "bg-rose-50 text-rose-500 shadow-sm")}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm">{symptom.label}</span>
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Mood Selection */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(mood => {
              const isActive = (currentLog?.moods || []).includes(mood);
              return (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMood(mood)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border shadow-sm",
                    isActive 
                      ? "bg-amber-400 text-white border-amber-400 shadow-lg shadow-amber-200" 
                      : "bg-white text-gray-500 border-pink-50 hover:bg-amber-50"
                  )}
                >
                  {mood}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Cervical Fluid */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Droplet size={16} className="text-blue-400" /> Cervical Fluid
          </h3>
          <div className="flex flex-wrap gap-2">
            {MUCUS_TYPES.map(type => {
              const isActive = currentLog?.cervicalMucus === type.id;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSave(today, { cervicalMucus: type.id as any })}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border shadow-sm",
                    isActive 
                      ? "bg-blue-400 text-white border-blue-400 shadow-lg shadow-blue-200" 
                      : "bg-white text-gray-500 border-pink-50 hover:bg-blue-50"
                  )}
                >
                  {type.label}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Intimacy */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Heart size={16} className="text-rose-400" /> Intimacy
          </h3>
          <div className="flex flex-wrap gap-2">
            {INTIMACY_TYPES.map(type => {
              const isActive = currentLog?.intimacy === type.id;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSave(today, { intimacy: type.id as any })}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border shadow-sm",
                    isActive 
                      ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200" 
                      : "bg-white text-gray-500 border-pink-50 hover:bg-rose-50"
                  )}
                >
                  {type.label}
                </motion.button>
              )
            })}
          </div>
        </section>

        {/* Temperature, Sleep, Water */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-pink-50 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Moon size={18} />
              <span className="font-bold text-xs uppercase">Sleep</span>
            </div>
            <div className="flex items-center">
              <input 
                type="number" 
                min="0" max="24" step="0.5"
                value={currentLog?.sleepHours || ''} 
                onChange={(e) => onSave(today, { sleepHours: parseFloat(e.target.value) || 0 })}
                placeholder="8"
                className="w-16 text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-indigo-100 focus:border-indigo-400 transition-colors"
              />
              <span className="text-sm font-medium text-gray-400 ml-1">hrs</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-pink-50 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <GlassWater size={18} />
              <span className="font-bold text-xs uppercase">Water</span>
            </div>
            <div className="flex items-center">
              <input 
                type="number" 
                min="0" step="100"
                value={currentLog?.waterIntake || ''} 
                onChange={(e) => onSave(today, { waterIntake: parseInt(e.target.value) || 0 })}
                placeholder="1500"
                className="w-20 text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-cyan-100 focus:border-cyan-400 transition-colors"
              />
              <span className="text-sm font-medium text-gray-400 ml-1">ml</span>
            </div>
          </div>
        </section>
        
        {/* BBT Temperature */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Thermometer size={16} className="text-orange-400" /> Basal Body Temp
          </h3>
          <div className="flex items-center">
            <input 
              type="number" 
              min="35" max="42" step="0.01"
              value={currentLog?.temperature || ''} 
              onChange={(e) => onSave(today, { temperature: parseFloat(e.target.value) || undefined })}
              placeholder="36.50"
              className="w-full max-w-[120px] text-3xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-orange-100 focus:border-orange-400 transition-colors"
            />
            <span className="text-xl font-bold text-gray-400 ml-2">°C</span>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Pencil size={16} className="text-emerald-400" /> Notes
          </h3>
          <textarea 
            value={currentLog?.notes || ''} 
            onChange={(e) => onSave(today, { notes: e.target.value })}
            placeholder="How was your day? Write down anything you want to remember..."
            className="w-full h-32 p-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-700 outline-none border border-transparent focus:border-emerald-200 focus:bg-white transition-all resize-none"
          />
        </section>

      </div>
    </motion.div>
  );
}
