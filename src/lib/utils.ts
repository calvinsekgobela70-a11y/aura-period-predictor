import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays, addDays, parseISO, isAfter, isBefore, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

export const getNextPeriodPrediction = (lastPeriodDate: string, cycleLength: number) => {
  if (!lastPeriodDate) return null;
  const date = parseISO(lastPeriodDate);
  if (!isValid(date)) return null;
  return addDays(date, cycleLength);
};

export const getCycleDay = (lastPeriodDate: string) => {
  if (!lastPeriodDate) return 1;
  const start = parseISO(lastPeriodDate);
  const today = new Date();
  if (!isValid(start)) return 1;
  return Math.max(1, differenceInDays(today, start) + 1);
};
