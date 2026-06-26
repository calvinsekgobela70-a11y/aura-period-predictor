import React from 'react';
import { motion } from 'motion/react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CycleData } from '../types';
import { cn, getNextPeriodPrediction } from '../lib/utils';

interface CalendarViewProps {
  data: CycleData;
}

export function CalendarView({ data }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Build a fast lookup for period days
  const periodDays = new Set<string>();
  data.periods.forEach(p => {
    const start = parseISO(p.startDate);
    const end = p.endDate ? parseISO(p.endDate) : new Date();
    const daysInPeriod = eachDayOfInterval({ start, end });
    daysInPeriod.forEach(d => periodDays.add(format(d, 'yyyy-MM-dd')));
  });

  // Calculate predicted days (just for the next cycle for visual flair)
  const predictedDays = new Set<string>();
  if (data.periods.length > 0) {
    const latest = data.periods[0];
    const nextStart = getNextPeriodPrediction(latest.startDate, data.settings.averageCycleLength);
    if (nextStart) {
      for (let i = 0; i < data.settings.averagePeriodLength; i++) {
        predictedDays.add(format(addDays(nextStart, i), 'yyyy-MM-dd'));
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col pt-8 pb-32 px-6 min-h-screen"
    >
      <header className="w-full flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">Calendar</h2>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition">
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-semibold text-gray-700 min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[40px] p-6 shadow-xl shadow-pink-100/50 border border-pink-50">
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs font-bold text-gray-400">{day}</div>
          ))}
          
          {/* Empty cells for start of month alignment */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isPeriod = periodDays.has(dateStr);
            const isPredicted = predictedDays.has(dateStr);
            const isToday = isSameDay(day, new Date());
            const hasLog = !!data.symptoms[dateStr];

            return (
              <motion.div 
                key={dateStr}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="aspect-square flex items-center justify-center relative cursor-pointer"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all z-10",
                  isPeriod ? "bg-[#FF6B9D] text-white shadow-lg shadow-pink-200" : 
                  isPredicted ? "bg-pink-50 border-2 border-pink-200 text-pink-500 border-dashed" :
                  isToday ? "bg-rose-500 text-white" : "text-gray-600 hover:bg-rose-50"
                )}>
                  {format(day, 'd')}
                </div>
                {hasLog && !isPeriod && (
                  <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-[20px] bg-pink-50 text-pink-700 font-medium text-sm">
          <div className="w-4 h-4 rounded-full bg-[#FF6B9D] shadow-sm" />
          Period Days
        </div>
        <div className="flex items-center gap-3 p-4 rounded-[20px] bg-white shadow-sm text-gray-600 font-medium text-sm border border-pink-50">
          <div className="w-4 h-4 rounded-full border-2 border-pink-300 border-dashed bg-pink-50" />
          Predicted
        </div>
      </div>
    </motion.div>
  );
}

// Add days helper since it's not exported from utils directly in this scope
function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}
