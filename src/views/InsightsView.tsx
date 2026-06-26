import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CycleData, SymptomLog } from '../types';
import { Activity, Clock, CalendarDays, Moon, GlassWater, Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { subDays, format, parseISO } from 'date-fns';

export function InsightsView({ data }: { data: CycleData }) {
  // Simple stats calculation
  const totalPeriods = data.periods.length;
  
  // Calculate actual average if enough data exists
  let computedCycleAvg = data.settings.averageCycleLength;
  let computedPeriodAvg = data.settings.averagePeriodLength;
  
  if (totalPeriods > 1) {
    let totalCycleDays = 0;
    for (let i = 0; i < data.periods.length - 1; i++) {
      const d1 = new Date(data.periods[i].startDate);
      const d2 = new Date(data.periods[i+1].startDate);
      totalCycleDays += Math.abs((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
    }
    computedCycleAvg = Math.round(totalCycleDays / (totalPeriods - 1));
  }

  const last7DaysData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = data.symptoms[dateStr] as SymptomLog | undefined;
      return {
        date: format(date, 'E'),
        sleep: log?.sleepHours || 0,
        water: log?.waterIntake || 0,
        temp: log?.temperature || null,
      };
    });
  }, [data.symptoms]);

  const hasTempData = last7DaysData.some(d => d.temp !== null);
  const hasSleepData = last7DaysData.some(d => d.sleep > 0);
  const hasWaterData = last7DaysData.some(d => d.water > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col pt-8 pb-32 px-6 min-h-screen"
    >
      <header className="mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">Insights</h2>
        <p className="text-gray-400 font-medium">Your body's patterns</p>
      </header>

      <div className="grid gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[32px] text-white shadow-lg"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Activity className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-white/60 font-black text-xs uppercase tracking-tighter">Average Cycle</p>
              <p className="text-3xl font-black">{computedCycleAvg}</p>
              <p className="text-white/70 font-medium text-sm mt-1">days</p>
            </div>
          </div>
          
          <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-white h-full rounded-full" 
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 flex flex-col justify-between h-40"
          >
            <Clock className="text-blue-500 mb-2" size={28} />
            <div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-tighter">Period Length</p>
              <p className="text-3xl font-black text-gray-800">{computedPeriodAvg} <span className="text-sm text-gray-400 font-medium">days</span></p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 flex flex-col justify-between h-40"
          >
            <CalendarDays className="text-amber-500 mb-2" size={28} />
            <div>
              <p className="text-gray-400 font-black text-xs uppercase tracking-tighter">Total Logs</p>
              <p className="text-3xl font-black text-gray-800">{totalPeriods} <span className="text-sm text-gray-400 font-medium">cycles</span></p>
            </div>
          </motion.div>
        </div>

        {hasTempData && (
          <motion.div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 mt-4 h-64">
             <div className="flex items-center gap-2 mb-4 text-orange-400">
               <Thermometer size={18} />
               <span className="font-bold text-xs uppercase tracking-wider">BBT Trend (Last 7 Days)</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={last7DaysData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="temp" stroke="#fb923c" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
               </AreaChart>
             </ResponsiveContainer>
          </motion.div>
        )}

        {hasSleepData && (
          <motion.div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 mt-4 h-64">
             <div className="flex items-center gap-2 mb-4 text-indigo-400">
               <Moon size={18} />
               <span className="font-bold text-xs uppercase tracking-wider">Sleep (Last 7 Days)</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={last7DaysData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <Tooltip cursor={{ fill: '#e0e7ff' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="sleep" fill="#818cf8" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </motion.div>
        )}

        {hasWaterData && (
          <motion.div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 mt-4 h-64">
             <div className="flex items-center gap-2 mb-4 text-cyan-400">
               <GlassWater size={18} />
               <span className="font-bold text-xs uppercase tracking-wider">Water Intake (Last 7 Days)</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={last7DaysData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                 <Tooltip cursor={{ fill: '#cffafe' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="water" fill="#22d3ee" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </motion.div>
        )}

        {!hasTempData && !hasSleepData && !hasWaterData && (
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50 mt-4 min-h-[200px] flex items-center justify-center relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-pink-50/50" />
             <div className="relative text-center z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 text-[#FF6B9D] rounded-full flex items-center justify-center">
                  <Activity size={32} />
                </div>
                <h3 className="font-bold text-gray-700">More data needed</h3>
                <p className="text-sm text-gray-500 px-4 mt-2">Log your daily temperature, sleep, or water intake to unlock health trends and charts.</p>
             </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
