import type { OuraData, SaunaSessionsData, SaunaSession } from "../types";

// Demo data - loaded from public folder at module level
const demoOuraData: OuraData[] = await fetch('/oura_2025_data.json').then(
  (response) => response.json()
);
const demoSaunaData: SaunaSessionsData = await fetch(
  '/sauna_sessions_data.json'
).then((response) => response.json());

/**
 * Daily combined data interface
 * Contains data for a single day, with optional oura data and/or sauna sessions
 */
export interface DailyCombinedData {
  date: string; // ISO date string (YYYY-MM-DD)
  ouraData?: OuraData; // Only present if oura data exists for this day
  saunaSessions?: SaunaSession[]; // Only present if sauna sessions exist for this day
  year: number; // Metadata
  month?: number; // Metadata (only for monthly data)
}

/**
 * Combined monthly data interface
 * Array of daily combined data for the month
 */
export interface CombinedMonthlyData {
  dailyData: DailyCombinedData[];
  year: number;
  month: number;
}

/**
 * Combined yearly data interface
 * Array of daily combined data for the year
 */
export interface CombinedYearlyData {
  dailyData: DailyCombinedData[];
  year: number;
}

/**
 * Chart data point for weekly charts
 */
export interface WeeklyChartDataPoint {
  day: string; // Day name (Mon, Tue, etc.)
  date: string; // Date in YYYY-MM-DD format
  sleepScore?: number;
  saunaMinutes?: number;
  restingHeartRateScore?: number;
  hrvBalanceScore?: number;
}

/**
 * Weekly stats interface
 */
export interface WeeklyStats {
  // General stats
  general: {
    sessionCount: number;
    totalMinutes: number;
    streakWeeks: number;
  };
  
  // Sleep stats
  sleep: {
    remImprovement: number; // Improvement in minutes
    deepSleepImprovement: number; // Improvement in minutes
    totalSleepImprovement: number; // Improvement in minutes
    chartData: WeeklyChartDataPoint[]; // Sleep score (line) and sauna minutes (bar)
  };
  
  // Heart rate stats
  heartRate: {
    hrvImprovement: number; // Improvement in HRV Balance Score
    restingHeartRateScoreImprovement: number; // Improvement in Resting Heart Rate Score
    chartData: WeeklyChartDataPoint[]; // Both scores as lines/bars
  };
  
  // Week metadata
  weekStart: string; // Monday date (YYYY-MM-DD)
  weekEnd: string; // Sunday date (YYYY-MM-DD)
  isPreviousWeek: boolean; // True if this is previous week (returned on Monday)
}

/**
 * Helper function to format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the Monday of the week for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the Sunday of the week for a given date
 */
function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
}

/**
 * Get all dates in a week (Monday to Sunday)
 */
function getWeekDates(weekStart: Date): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
}

/**
 * Get day name abbreviation
 */
function getDayName(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

/**
 * DataService - Service for querying Oura and Sauna session data
 * Can be initialized with demo data, custom data, or a combination of both
 */
export class DataService {
  private ouraData: OuraData[];
  private saunaData: SaunaSessionsData;

  /**
   * Initialize DataService with optional data sources
   * @param ouraData - Optional: Custom OuraData[] (defaults to demo data if not provided)
   * @param saunaData - Optional: Custom SaunaSessionsData (defaults to demo data if not provided)
   * 
   * @example
   * // Use demo data for both
   * new DataService()
   * 
   * // Custom Oura data, demo Sauna data
   * new DataService(customOuraData)
   * 
   * // Demo Oura data, custom Sauna data
   * new DataService(undefined, customSaunaData)
   * 
   * // Custom data for both
   * new DataService(customOuraData, customSaunaData)
   */
  constructor(
    ouraData?: OuraData[],
    saunaData?: SaunaSessionsData
  ) {
    this.ouraData = ouraData ?? demoOuraData;
    this.saunaData = saunaData ?? demoSaunaData;
  }

  /**
   * Get Oura data filtered by month and year
   * @param year Year to filter (e.g., 2025)
   * @param month Month to filter (1-12, where 1 = January)
   * @returns Filtered array of Oura data for the specified month
   */
  getMonthlyOuraData(year: number, month: number): OuraData[] {
    return this.ouraData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === year && entryDate.getMonth() === month - 1
      );
    });
  }

  /**
   * Get all Oura data for a specific year
   * @param year Year to filter (e.g., 2025)
   * @returns Filtered array of Oura data for the specified year
   */
  getYearlyOuraData(year: number): OuraData[] {
    return this.ouraData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year;
    });
  }

  /**
   * Get sauna sessions filtered by month and year
   * @param year Year to filter (e.g., 2025)
   * @param month Month to filter (1-12, where 1 = January)
   * @returns Filtered array of sauna sessions for the specified month
   */
  getMonthlySaunaSessions(year: number, month: number): SaunaSession[] {
    return this.saunaData.sessions.filter((session) => {
      const sessionDate = new Date(session.timestamp);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month - 1
      );
    });
  }

  /**
   * Get all sauna sessions for a specific year
   * @param year Year to filter (e.g., 2025)
   * @returns Filtered array of sauna sessions for the specified year
   */
  getYearlySaunaSessions(year: number): SaunaSession[] {
    return this.saunaData.sessions.filter((session) => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate.getFullYear() === year;
    });
  }

  /**
   * Get combined Oura and Sauna session data for a specific day
   * @param year Year to filter (e.g., 2025)
   * @param month Month to filter (1-12, where 1 = January)
   * @param day Day of the month (1-31)
   * @returns DailyCombinedData for the specified day, or null if no data exists for that day
   */
  getDailyData(
    year: number,
    month: number,
    day: number
  ): DailyCombinedData | null {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Get Oura data for the day
    const ouraEntry = this.ouraData.find((entry) => entry.date === dateStr);

    // Get Sauna sessions for the day
    const saunaSessions = this.saunaData.sessions.filter((session) => {
      const sessionDate = new Date(session.timestamp);
      const sessionDateStr = formatDate(sessionDate);
      return sessionDateStr === dateStr;
    });

    // Return null if no data exists for this day
    if (!ouraEntry && saunaSessions.length === 0) {
      return null;
    }

    // Build the daily combined data
    const dailyData: DailyCombinedData = {
      date: dateStr,
      year,
      month,
    };

    if (ouraEntry) {
      dailyData.ouraData = ouraEntry;
    }

    if (saunaSessions.length > 0) {
      dailyData.saunaSessions = saunaSessions;
    }

    return dailyData;
  }

  /**
   * Get combined Oura and Sauna session data for a specific month, combined on a daily level
   * @param year Year to filter (e.g., 2025)
   * @param month Month to filter (1-12, where 1 = January)
   * @returns Combined data object with daily-level combined Oura and Sauna session data for the month
   */
  getCombinedMonthlyData(
    year: number,
    month: number
  ): CombinedMonthlyData {
    const monthlyOuraData = this.getMonthlyOuraData(year, month);
    const monthlySaunaSessions = this.getMonthlySaunaSessions(year, month);

    // Create a map of dates to combine data
    const dailyMap = new Map<string, DailyCombinedData>();

    // Add Oura data by date
    monthlyOuraData.forEach((ouraEntry) => {
      const date = ouraEntry.date; // Oura data already has date in YYYY-MM-DD format
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          year,
          month,
        });
      }
      dailyMap.get(date)!.ouraData = ouraEntry;
    });

    // Add Sauna sessions by date
    monthlySaunaSessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp);
      const date = formatDate(sessionDate);

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          year,
          month,
        });
      }

      const dailyEntry = dailyMap.get(date)!;
      if (!dailyEntry.saunaSessions) {
        dailyEntry.saunaSessions = [];
      }
      dailyEntry.saunaSessions.push(session);
    });

    // Convert map to sorted array
    const dailyData = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return {
      dailyData,
      year,
      month,
    };
  }

  /**
   * Get combined Oura and Sauna session data for a specific year, combined on a daily level
   * @param year Year to filter (e.g., 2025)
   * @returns Combined data object with daily-level combined Oura and Sauna session data for the year
   */
  getCombinedYearlyData(year: number): CombinedYearlyData {
    const yearlyOuraData = this.getYearlyOuraData(year);
    const yearlySaunaSessions = this.getYearlySaunaSessions(year);

    // Create a map of dates to combine data
    const dailyMap = new Map<string, DailyCombinedData>();

    // Add Oura data by date
    yearlyOuraData.forEach((ouraEntry) => {
      const date = ouraEntry.date; // Oura data already has date in YYYY-MM-DD format
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          year,
        });
      }
      dailyMap.get(date)!.ouraData = ouraEntry;
    });

    // Add Sauna sessions by date
    yearlySaunaSessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp);
      const date = formatDate(sessionDate);

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          year,
        });
      }

      const dailyEntry = dailyMap.get(date)!;
      if (!dailyEntry.saunaSessions) {
        dailyEntry.saunaSessions = [];
      }
      dailyEntry.saunaSessions.push(session);
    });

    // Convert map to sorted array
    const dailyData = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return {
      dailyData,
      year,
    };
  }

  /**
   * Get weekly stats for the current week (or previous week if today is Monday)
   * @param referenceDate - Optional date to use as reference (defaults to today)
   * @returns WeeklyStats with general stats, sleep stats, and heart rate stats
   */
  getWeeklyStats(referenceDate: Date = new Date()): WeeklyStats {
    // If it's Monday, return previous week's stats
    const isMonday = referenceDate.getDay() === 1;
    const targetDate = isMonday
      ? new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000) // Go back 7 days
      : referenceDate;

    const weekStart = getWeekStart(targetDate);
    const weekEnd = getWeekEnd(targetDate);
    const weekDates = getWeekDates(weekStart);

    // Get daily data for the week
    const weekData: DailyCombinedData[] = [];
    for (const dateStr of weekDates) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dailyData = this.getDailyData(year, month, day);
      if (dailyData) {
        weekData.push(dailyData);
      }
    }

    // Calculate general stats
    let sessionCount = 0;
    let totalMinutes = 0;
    for (const day of weekData) {
      if (day.saunaSessions) {
        sessionCount += day.saunaSessions.length;
        totalMinutes += day.saunaSessions.reduce(
          (sum, session) => sum + session.duration_minutes,
          0
        );
      }
    }

    // Calculate streak (consecutive weeks with at least one session)
    let streakWeeks = 0;
    let checkDate = new Date(weekStart);
    while (true) {
      const checkWeekStart = getWeekStart(checkDate);
      const checkWeekDates = getWeekDates(checkWeekStart);

      let hasSession = false;
      for (const dateStr of checkWeekDates) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dailyData = this.getDailyData(year, month, day);
        if (dailyData?.saunaSessions && dailyData.saunaSessions.length > 0) {
          hasSession = true;
          break;
        }
      }

      if (!hasSession) break;
      streakWeeks++;
      checkDate = new Date(checkDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Create a map to check if previous day had sauna
    // For sleep: we compare the night AFTER sauna (day X+1) vs nights not after sauna
    const daysWithSauna = new Set<string>();
    for (const dayData of weekData) {
      if (dayData.saunaSessions && dayData.saunaSessions.length > 0) {
        daysWithSauna.add(dayData.date);
      }
    }

    // Calculate sleep stats - compare nights after sauna vs nights not after sauna
    let nightsAfterSaunaREM = 0;
    let nightsAfterSaunaDeep = 0;
    let nightsAfterSaunaTotal = 0;
    let nightsNotAfterSaunaREM = 0;
    let nightsNotAfterSaunaDeep = 0;
    let nightsNotAfterSaunaTotal = 0;
    let nightsAfterSaunaCount = 0;
    let nightsNotAfterSaunaCount = 0;

    const sleepChartData: WeeklyChartDataPoint[] = [];

    for (let i = 0; i < 7; i++) {
      const dateStr = weekDates[i];
      const date = new Date(dateStr + 'T00:00:00');
      const dayName = getDayName(date);
      const dayData = weekData.find((d) => d.date === dateStr);

      const chartPoint: WeeklyChartDataPoint = {
        day: dayName,
        date: dateStr,
      };

      // Check if previous day had sauna (for sleep, we look at the night after sauna)
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = formatDate(prevDate);
      const isNightAfterSauna = daysWithSauna.has(prevDateStr);

      if (dayData?.ouraData) {
        const rem = dayData.ouraData['REM Sleep Duration'];
        const deep = dayData.ouraData['Deep Sleep Duration'];
        const total = dayData.ouraData['Total Sleep Duration'];

        // Only include values that are not null/undefined
        if (rem != null && deep != null && total != null) {
          const remMinutes = rem / 60; // Convert seconds to minutes
          const deepMinutes = deep / 60; // Convert seconds to minutes
          const totalMinutes = total / 60; // Convert seconds to minutes

          if (isNightAfterSauna) {
            nightsAfterSaunaREM += remMinutes;
            nightsAfterSaunaDeep += deepMinutes;
            nightsAfterSaunaTotal += totalMinutes;
            nightsAfterSaunaCount++;
          } else {
            nightsNotAfterSaunaREM += remMinutes;
            nightsNotAfterSaunaDeep += deepMinutes;
            nightsNotAfterSaunaTotal += totalMinutes;
            nightsNotAfterSaunaCount++;
          }
        }

        chartPoint.sleepScore = dayData.ouraData['Sleep Score'];
      }

      if (dayData?.saunaSessions) {
        const saunaMinutes = dayData.saunaSessions.reduce(
          (sum, session) => sum + session.duration_minutes,
          0
        );
        chartPoint.saunaMinutes = saunaMinutes;
      }

      sleepChartData.push(chartPoint);
    }

    // Calculate average per night for each group (only if we have valid data points)
    let avgNightsAfterSaunaREM = 0;
    let avgNightsAfterSaunaDeep = 0;
    let avgNightsAfterSaunaTotal = 0;
    let avgNightsNotAfterSaunaREM = 0;
    let avgNightsNotAfterSaunaDeep = 0;
    let avgNightsNotAfterSaunaTotal = 0;

    if (nightsAfterSaunaCount > 0) {
      avgNightsAfterSaunaREM = nightsAfterSaunaREM / nightsAfterSaunaCount;
      avgNightsAfterSaunaDeep = nightsAfterSaunaDeep / nightsAfterSaunaCount;
      avgNightsAfterSaunaTotal = nightsAfterSaunaTotal / nightsAfterSaunaCount;
    }

    if (nightsNotAfterSaunaCount > 0) {
      avgNightsNotAfterSaunaREM = nightsNotAfterSaunaREM / nightsNotAfterSaunaCount;
      avgNightsNotAfterSaunaDeep = nightsNotAfterSaunaDeep / nightsNotAfterSaunaCount;
      avgNightsNotAfterSaunaTotal = nightsNotAfterSaunaTotal / nightsNotAfterSaunaCount;
    }

    // Calculate percentage improvements (nights after sauna vs nights not after sauna)
    // Only calculate if both groups have valid data
    const remImprovement = (nightsAfterSaunaCount > 0 && nightsNotAfterSaunaCount > 0 && avgNightsNotAfterSaunaREM > 0)
      ? ((avgNightsAfterSaunaREM - avgNightsNotAfterSaunaREM) / avgNightsNotAfterSaunaREM) * 100
      : 0;
    const deepSleepImprovement = (nightsAfterSaunaCount > 0 && nightsNotAfterSaunaCount > 0 && avgNightsNotAfterSaunaDeep > 0)
      ? ((avgNightsAfterSaunaDeep - avgNightsNotAfterSaunaDeep) / avgNightsNotAfterSaunaDeep) * 100
      : 0;
    const totalSleepImprovement = (nightsAfterSaunaCount > 0 && nightsNotAfterSaunaCount > 0 && avgNightsNotAfterSaunaTotal > 0)
      ? ((avgNightsAfterSaunaTotal - avgNightsNotAfterSaunaTotal) / avgNightsNotAfterSaunaTotal) * 100
      : 0;

    // Calculate heart rate stats - compare days with sauna vs days without sauna (same day)
    let saunaDaysHRV = 0;
    let saunaDaysRHRScore = 0;
    let noSaunaDaysHRV = 0;
    let noSaunaDaysRHRScore = 0;
    let saunaDaysHRVCount = 0;
    let noSaunaDaysHRVCount = 0;
    let saunaDaysRHRCount = 0;
    let noSaunaDaysRHRCount = 0;

    const heartRateChartData: WeeklyChartDataPoint[] = [];

    for (let i = 0; i < 7; i++) {
      const dateStr = weekDates[i];
      const date = new Date(dateStr + 'T00:00:00');
      const dayName = getDayName(date);
      const dayData = weekData.find((d) => d.date === dateStr);

      const chartPoint: WeeklyChartDataPoint = {
        day: dayName,
        date: dateStr,
      };

      // Check if this day had sauna (for heart rate, we look at the same day)
      const hasSauna = dayData?.saunaSessions && dayData.saunaSessions.length > 0;

      if (dayData?.ouraData) {
        const hrv = dayData.ouraData['HRV Balance Score'];
        const rhr = dayData.ouraData['Resting Heart Rate Score'];

        // Handle HRV and RHR independently - count each only if it's not null
        if (hrv != null) {
          if (hasSauna) {
            saunaDaysHRV += hrv;
            saunaDaysHRVCount++;
          } else {
            noSaunaDaysHRV += hrv;
            noSaunaDaysHRVCount++;
          }
        }

        if (rhr != null) {
          if (hasSauna) {
            saunaDaysRHRScore += rhr;
            saunaDaysRHRCount++;
          } else {
            noSaunaDaysRHRScore += rhr;
            noSaunaDaysRHRCount++;
          }
        }

        chartPoint.hrvBalanceScore = hrv;
        chartPoint.restingHeartRateScore = rhr;
      }

      if (dayData?.saunaSessions) {
        const saunaMinutes = dayData.saunaSessions.reduce(
          (sum, session) => sum + session.duration_minutes,
          0
        );
        chartPoint.saunaMinutes = saunaMinutes;
      }

      heartRateChartData.push(chartPoint);
    }

    // Calculate average per day for each group (only if we have valid data points)
    let avgSaunaDaysHRV = 0;
    let avgSaunaDaysRHRScore = 0;
    let avgNoSaunaDaysHRV = 0;
    let avgNoSaunaDaysRHRScore = 0;

    if (saunaDaysHRVCount > 0) {
      avgSaunaDaysHRV = saunaDaysHRV / saunaDaysHRVCount;
    }

    if (noSaunaDaysHRVCount > 0) {
      avgNoSaunaDaysHRV = noSaunaDaysHRV / noSaunaDaysHRVCount;
    }

    if (saunaDaysRHRCount > 0) {
      avgSaunaDaysRHRScore = saunaDaysRHRScore / saunaDaysRHRCount;
    }

    if (noSaunaDaysRHRCount > 0) {
      avgNoSaunaDaysRHRScore = noSaunaDaysRHRScore / noSaunaDaysRHRCount;
    }

    // Calculate percentage improvements (days with sauna vs days without sauna)
    // Only calculate if both groups have valid data
    const hrvImprovement = (saunaDaysHRVCount > 0 && noSaunaDaysHRVCount > 0 && avgNoSaunaDaysHRV > 0) 
      ? ((avgSaunaDaysHRV - avgNoSaunaDaysHRV) / avgNoSaunaDaysHRV) * 100 
      : 0;
    const restingHeartRateScoreImprovement = (saunaDaysRHRCount > 0 && noSaunaDaysRHRCount > 0 && avgNoSaunaDaysRHRScore > 0)
      ? ((avgSaunaDaysRHRScore - avgNoSaunaDaysRHRScore) / avgNoSaunaDaysRHRScore) * 100
      : 0;

    return {
      general: {
        sessionCount,
        totalMinutes,
        streakWeeks,
      },
      sleep: {
        remImprovement,
        deepSleepImprovement,
        totalSleepImprovement,
        chartData: sleepChartData,
      },
      heartRate: {
        hrvImprovement,
        restingHeartRateScoreImprovement,
        chartData: heartRateChartData,
      },
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      isPreviousWeek: isMonday,
    };
  }
}
