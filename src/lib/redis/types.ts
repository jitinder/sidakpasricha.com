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
