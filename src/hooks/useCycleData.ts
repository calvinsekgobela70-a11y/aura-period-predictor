import { useState, useEffect, useCallback } from 'react';
import { CycleData, Period, SymptomLog } from '../types';
import { getTodayStr } from '../lib/utils';

const DEFAULT_DATA: CycleData = {
  periods: [],
  symptoms: {},
  settings: {
    averageCycleLength: 28,
    averagePeriodLength: 5,
    waterGoal: 2000,
    sleepGoal: 8,
    userName: 'Aura',
  },
};

export function useCycleData() {
  const [data, setData] = useState<CycleData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aura_cycle_data');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cycle data", e);
      }
    }
    setLoaded(true);
  }, []);

  const saveData = useCallback((newData: CycleData) => {
    setData(newData);
    localStorage.setItem('aura_cycle_data', JSON.stringify(newData));
  }, []);

  const updateSettings = (settings: Partial<CycleData['settings']>) => {
    saveData({ ...data, settings: { ...data.settings, ...settings } });
  };

  const addPeriod = (startDate: string, endDate: string | null = null) => {
    const newPeriod: Period = {
      id: Math.random().toString(36).substring(7),
      startDate,
      endDate,
    };
    saveData({ ...data, periods: [...data.periods, newPeriod].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) });
  };

  const endCurrentPeriod = (endDate: string) => {
    if (data.periods.length === 0) return;
    const updatedPeriods = [...data.periods];
    if (updatedPeriods[0].endDate === null) {
      updatedPeriods[0].endDate = endDate;
      saveData({ ...data, periods: updatedPeriods });
    }
  };
  
  const deletePeriod = (id: string) => {
    saveData({ ...data, periods: data.periods.filter(p => p.id !== id) });
  };

  const updateSymptom = (date: string, symptom: Partial<SymptomLog>) => {
    const existing = data.symptoms[date] || { date };
    saveData({
      ...data,
      symptoms: {
        ...data.symptoms,
        [date]: { ...existing, ...symptom },
      }
    });
  };

  const getLatestPeriod = () => data.periods.length > 0 ? data.periods[0] : null;

  return {
    data,
    loaded,
    updateSettings,
    addPeriod,
    endCurrentPeriod,
    deletePeriod,
    updateSymptom,
    getLatestPeriod
  };
}
