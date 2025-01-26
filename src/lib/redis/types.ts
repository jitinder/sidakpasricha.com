export enum RedisEnv {
  DEV = "dev",
  PROD = "prod",
}

export type Target = {
  weight: number;
  bodyFat: number;
  deadline: number; // Unix timestamp
};

export type Log = Target;

export type DailyChecklist = {
  date: number; // Unix timestamp
  workout: boolean;
  progressPicture: boolean;
  diet: boolean;
  logProgress: boolean;
  steps: boolean;
  sleep: boolean;
  water: boolean;
};
