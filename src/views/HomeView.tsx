import React from 'react';
import { motion } from 'motion/react';
import { getCycleDay, getNextPeriodPrediction } from '../lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { Period } from '../types';

interface HomeViewProps {
  latestPeriod: Period | null;
  cycleLength: number;
  periodLength: number;
  onLogFlow: () => void;
  userName?: string;
}

export function HomeView({ latestPeriod, cycleLength, periodLength, onLogFlow, userName }: HomeViewProps) {
  const currentDay = latestPeriod ? getCycleDay(latestPeriod.startDate) : 0;
  const isCurrentlyBleeding = latestPeriod && latestPeriod.endDate === null;
  
  const nextPeriodDate = latestPeriod 
    ? getNextPeriodPrediction(latestPeriod.startDate, cycleLength)
    : null;

  const daysUntilNext = nextPeriodDate 
    ? Math.max(0, differenceInDays(nextPeriodDate, new Date()))
    : 0;

  const progress = latestPeriod ? Math.min(100, (currentDay / cycleLength) * 100) : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center pt-8 pb-32 px-6 min-h-screen"
    >
      <header className="w-full text-center mb-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">{userName || 'Aura'}</h1>
        <p className="text-gray-400 font-medium">Your Cycle Tracker</p>
      </header>

      {/* Main Tracker Ring */}
      <div className="bg-white w-full rounded-[40px] shadow-xl shadow-pink-100/50 p-8 flex flex-col items-center justify-center relative overflow-hidden border border-pink-50 mb-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-50/50 rounded-full translate-x-12 -translate-y-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50 rounded-full -translate-x-8 translate-y-8 blur-2xl"></div>

        <div className="relative w-[260px] h-[260px] flex items-center justify-center mb-6 mt-4">
          <svg className="absolute w-[260px] h-[260px] transform -rotate-90 pointer-events-none drop-shadow-sm" viewBox="0 0 260 260">
            {/* Background Track */}
            <circle 
              cx="130" cy="130" r={radius} 
              stroke="#FFF1F5" 
              strokeWidth="24" fill="none" 
            />
            {/* Progress Track */}
            <motion.circle 
              cx="130" cy="130" r={radius} 
              stroke="#FF6B9D" 
              strokeWidth="24" 
              fill="none" 
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              strokeDasharray={circumference}
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center text-center">
            {latestPeriod ? (
              <>
                <span className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1">Day</span>
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-7xl font-black text-rose-500 tabular-nums leading-none tracking-tighter"
                >
                  {currentDay}
                </motion.span>
                
                <div className="mt-4 inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {isCurrentlyBleeding ? "Period" : (
                    currentDay > 10 && currentDay < 17 ? "Fertile Window" : "Follicular Phase"
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-400 font-medium px-8">No data yet. Log your first period!</div>
            )}
          </div>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="w-full max-w-md space-y-4">
        {nextPeriodDate && (
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Next Period</p>
              <p className="text-2xl font-bold text-gray-800">{format(nextPeriodDate, 'MMM do')}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-rose-500">{daysUntilNext}</p>
              <p className="text-sm font-medium text-pink-400">days away</p>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogFlow}
          className="w-full py-4 rounded-2xl bg-[#FF6B9D] text-white font-bold text-lg shadow-lg shadow-pink-200 hover:brightness-105 active:scale-95 transition-all relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
          {isCurrentlyBleeding ? "End Period" : "Log Period Starts Today"}
        </motion.button>
      </div>
    </motion.div>
  );
}
