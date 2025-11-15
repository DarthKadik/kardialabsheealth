// Oura Data Types
export interface OuraData {
  date: string;
  "Average Resting Heart Rate": number;
  "Sleep Efficiency Score": number;
  "Sleep Efficiency": number;
  "Deep Sleep Duration": number;
  "Bedtime End": string;
  "Readiness Score": number;
  "Low Activity Time": number;
  "Training Volume Score": number;
  "Activity Balance Score": number;
  "Previous Day Activity Score": number;
  "Sleep Timing": number;
  "Awake Time": number;
  "Sleep Score": number;
  "Steps": number;
  "Respiratory Rate": number;
  "Bedtime Start": string;
  "Activity Burn": number;
  "Non-wear Time": number;
  "Sleep Timin Score": number;
  "HRV Balance Score": number;
  "Total Sleep Score": number;
  "Total Bedtime ": number;
  "Long Periods of Inactivity": number;
  "Average HRV": number;
  "Activity Score": number;
  "Sleep Balance Score": number;
  "Total Sleep Duration": number;
  "Total Burn": number;
  "Resting Heart Rate Score": number;
  "Lowest Resting Heart Rate": number;
  "High Activity Time": number;
  "Training Frequency Score": number;
  "Restless Sleep": number;
  "Light Sleep Duration": number;
  "Restfulness Score": number;
  "Meet Daily Targets Score": number;
  "Average MET": number;
  "REM Sleep Duration": number;
  "Sleep Latency Score": number;
  "REM Sleep Score": number;
  "Rest Time": number;
  "Temperature Deviation (°C)": number;
  "Temperature Trend Deviation": number;
  "Stay Active Score": number;
  "Recovery Index Score": number;
  "Medium Activity Time": number;
  "Previous Night Score": number;
  "Equivalent Walking Distance": number;
  "Deep Sleep Score": number;
  "Temperature Score": number;
  "Inactive Time": number;
  "Sleep Latency": number;
  "Move Every Hour Score": number;
}

// Sauna Sessions Data Types
export interface SaunaSessionType {
  id: number;
  title: string;
  duration_mean: number;
  duration_std: number;
  temp_range: [number, number];
  humidity_range: [number, number];
  heart_rate_mean: number;
  heart_rate_std: number;
}

export interface SaunaSessionTimeSeries {
  time_minutes: number;
  temperature_celsius: number;
  humidity_percent: number;
  heart_rate_bpm: number;
}

export interface SaunaSession {
  session_id: string;
  timestamp: string;
  session_type_id: number;
  session_type_title: string;
  duration_minutes: number;
  recovery_score: number;
  relaxation_score: number;
  enjoyment_score: number;
  time_series: SaunaSessionTimeSeries[];
}

export interface SaunaSessionsMetadata {
  generated_at: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  session_types: SaunaSessionType[];
}

export interface SaunaSessionsData {
  metadata: SaunaSessionsMetadata;
  sessions: SaunaSession[];
}

