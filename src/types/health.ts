// =========================================================
// AstroHealth Monitor — Type Definitions
// Based on NASA Human Research Program (HRP) indicators
// =========================================================

export type HealthStatus = 'nominal' | 'warning' | 'critical' | 'unknown';
export type MissionPhase = 'pre-launch' | 'early-mission' | 'mid-mission' | 'late-mission' | 'return';
export type TrendDirection = 'improving' | 'stable' | 'declining' | 'fluctuating';

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;        // critical low
  max: number;        // critical high
  warnLow: number;    // warning low
  warnHigh: number;   // warning high
  baselineValue: number;
  status: HealthStatus;
  trend: TrendDirection;
  lastUpdated: Date;
  history: TimeSeriesPoint[];
  description: string;
  nasaRef: string;    // NASA HRP reference
}

export interface TimeSeriesPoint {
  day: number;        // mission day
  value: number;
  status: HealthStatus;
}

export interface HealthDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  overallStatus: HealthStatus;
  riskScore: number;   // 0-100
  metrics: HealthMetric[];
  lastAssessment: Date;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  domain: string;
  metric: string;
  message: string;
  recommendation: string;
  timestamp: Date;
  acknowledged: boolean;
  nasaProtocol: string;
}

export interface SelfAssessment {
  id: string;
  date: Date;
  missionDay: number;
  domainId: string;
  responses: AssessmentResponse[];
  score: number;
  status: HealthStatus;
  notes: string;
}

export interface AssessmentResponse {
  questionId: string;
  question: string;
  value: number;       // 1-5 Likert
  category: string;
}

export interface AstronautProfile {
  id: string;
  name: string;
  rank: string;
  missionName: string;
  missionDay: number;
  missionDuration: number; // total planned days
  missionPhase: MissionPhase;
  overallHealthScore: number;  // 0-100
  criticalAlerts: number;
  warnings: number;
  lastCheckup: Date;
}

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  domain: string;
  action: string;
  protocol: string;
  dueDay: number;
  completed: boolean;
}

export interface RadiationData {
  totalDose: number;        // mGy
  dailyDose: number;        // μGy/day
  limit: number;            // career limit mGy
  percentUsed: number;
  galacticCosmicRays: number;
  solarParticleEvents: number;
  history: TimeSeriesPoint[];
}

