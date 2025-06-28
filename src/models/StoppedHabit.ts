export type StoppedDates = {
  from: string;
  to: string | null;
};

export type StoppedHabits = Record<string, StoppedDates[]>;
