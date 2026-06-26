export interface Period {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD or null if ongoing
}

export interface SymptomLog {
  date: string; // YYYY-MM-DD
  flow?: 'spotting' | 'light' | 'medium' | 'heavy' | null;
  moods?: string[];
  symptoms?: string[];
  temperature?: number;
  cervicalMucus?: 'dry' | 'sticky' | 'creamy' | 'egg_white' | null;
  intimacy?: 'none' | 'protected' | 'unprotected' | null;
  sleepHours?: number;
  waterIntake?: number; // in ml
  notes?: string;
}

export interface UserSettings {
  averageCycleLength: number; // Default 28
  averagePeriodLength: number; // Default 5
  waterGoal: number; // Default 2000ml
  sleepGoal: number; // Default 8 hours
}

export interface CycleData {
  periods: Period[];
  symptoms: Record<string, SymptomLog>;
  settings: UserSettings;
}

export type ViewState = 'home' | 'calendar' | 'log' | 'insights' | 'settings';
