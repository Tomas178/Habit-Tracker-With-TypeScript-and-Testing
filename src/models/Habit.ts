export interface Habit {
  id: number;
  name: string;
}

export type CompletedHabits = Record<string, number[]>;

export type StoppedDates = {
  from: string;
  to: string | null;
};

export type StoppedHabits = Record<string, StoppedDates[]>;
