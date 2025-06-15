const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const INTERVALS = {
   HOURLY: HOUR,
   DAILY: DAY,
} as const;
