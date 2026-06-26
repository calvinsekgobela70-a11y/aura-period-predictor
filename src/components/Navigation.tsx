import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Calendar, Home, Activity, PieChart, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface NavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export function Navigation({ currentView, onChange }: NavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'log', icon: Activity, label: 'Log' },
    { id: 'insights', icon: PieChart, label: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white/80 backdrop-blur-xl border-t border-pink-100/50 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onChange(item.id as ViewState)}
              className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-pink-50 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-pink-600" : "text-gray-300 hover:text-pink-400"
                  )}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
