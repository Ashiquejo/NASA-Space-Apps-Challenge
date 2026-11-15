// =========================================================
// AstroHealth Monitor — NASA HRP Reference Data
// Based on published NASA Human Research Program standards,
// ISS medical protocols, and peer-reviewed spaceflight studies.
// 
// Sources:
//  - NASA HRP Evidence Reports (2020-2024)
//  - Nicogossian et al., Space Physiology and Medicine (2016)
//  - Scott Kelly "Year in Space" longitudinal study (2019)
//  - Stahn et al., Behavioral Health in Space (2019)
//  - NASA-STD-3001 Human Integration Design Handbook
//  - NCRP Report 132: Radiation Limits for Astronauts
// =========================================================

import {
  HealthMetric, HealthDomain, Alert, AstronautProfile,
  ActionItem, RadiationData, TimeSeriesPoint, SelfAssessment
} from '../types/health';

// ---- Utility helpers ----
// Status helper reserved for future computed status updates
// function status(val: number, metric: ...) { ... }

function generateHistory(
  baseline: number,
  missionDays: number,
  driftFn: (day: number) => number,
  noiseFactor: number = 0.02
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  for (let day = 0; day <= missionDays; day += 5) {
    const drift = driftFn(day);
    const noise = (Math.random() - 0.5) * noiseFactor * baseline;
    const val = parseFloat((baseline + drift + noise).toFixed(2));
    points.push({ day, value: val, status: 'nominal' });
  }
  return points;
}

const MISSION_DAY = 142; // Current mission day (mid-mission ISS scenario)

// ---- Cardiovascular Metrics ----
// References: Perhonen et al., J Physiol (2001); Dorfman et al., J Physiol (2007)
// Plasma volume typically ↓8-12% in first week, partial recovery
// VO2max ↓17% at 6-month mark; HR rest ↑5-10 bpm; BP orthostatic changes

const heartRate: HealthMetric = {
  id: 'hr',
  name: 'Resting Heart Rate',
  value: 68,
  unit: 'bpm',
  min: 40, max: 110,
  warnLow: 50, warnHigh: 90,
  baselineValue: 62,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Resting HR. Space deconditioning typically raises baseline +5–10 bpm. Persistent tachycardia (>90) flags cardiovascular stress.',
  nasaRef: 'NASA-STD-3001 Vol.2; HRP-47060 Cardiovascular Risk',
  history: generateHistory(62, MISSION_DAY, (d) => 0.04 * d + 2 * Math.sin(d / 20), 0.015),
};

const bloodPressureSys: HealthMetric = {
  id: 'bp_sys',
  name: 'Systolic BP',
  value: 118,
  unit: 'mmHg',
  min: 80, max: 180,
  warnLow: 90, warnHigh: 140,
  baselineValue: 115,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Systolic blood pressure. Microgravity causes cephalic fluid shift and plasma volume reduction. Orthostatic hypotension risk on return.',
  nasaRef: 'HRP Evidence Report: Risk of Adverse CV Events (2022)',
  history: generateHistory(115, MISSION_DAY, (d) => 0.02 * d + Math.sin(d / 15), 0.02),
};

const bloodPressureDia: HealthMetric = {
  id: 'bp_dia',
  name: 'Diastolic BP',
  value: 76,
  unit: 'mmHg',
  min: 50, max: 120,
  warnLow: 60, warnHigh: 95,
  baselineValue: 74,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Diastolic blood pressure. Elevated diastolic in absence of systemic adaptation could indicate vascular stiffening from radiation.',
  nasaRef: 'HRP Evidence Report: Risk of Adverse CV Events (2022)',
  history: generateHistory(74, MISSION_DAY, (d) => 0.015 * d, 0.02),
};

const vo2max: HealthMetric = {
  id: 'vo2max',
  name: 'VO₂ Max',
  value: 38.5,
  unit: 'mL/kg/min',
  min: 25, max: 65,
  warnLow: 32, warnHigh: 62,
  baselineValue: 46.2,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Aerobic capacity. Expected decline ~17% at 6 months (ISS data). Falls below warning at 32 mL/kg/min. Countermeasure: 150+ min/week exercise.',
  nasaRef: 'Moore et al., J Physiol (2010); HRP CEVIS protocol',
  history: generateHistory(46.2, MISSION_DAY, (d) => -0.054 * d, 0.015),
};

const cardiacOutput: HealthMetric = {
  id: 'co',
  name: 'Cardiac Output',
  value: 4.8,
  unit: 'L/min',
  min: 3.0, max: 8.0,
  warnLow: 4.0, warnHigh: 7.0,
  baselineValue: 5.2,
  status: 'nominal',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Cardiac output estimated via impedance cardiography. Microgravity reduces preload; Starling mechanism adaptation. Monitor for cardiac atrophy.',
  nasaRef: 'Levine et al., J Physiol (2002); CVIS ISS study',
  history: generateHistory(5.2, MISSION_DAY, (d) => -0.003 * d, 0.02),
};

// ---- Bone & Musculoskeletal ----
// References: Vico et al., Lancet (2000); Lang et al., JBMR (2004); 
// Sibonga et al., Bone (2007) — 1-2% bone loss per month at lumbar spine and hip

const boneDensityLumbar: HealthMetric = {
  id: 'bmd_lumbar',
  name: 'Lumbar Bone Density',
  value: 0.91,
  unit: 'g/cm²',
  min: 0.70, max: 1.40,
  warnLow: 0.80, warnHigh: 1.35,
  baselineValue: 1.04,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Lumbar spine BMD via DXA. Spaceflight causes ~1–1.5%/month loss. High risk of fracture below 0.80 g/cm². ARED exercise is primary countermeasure.',
  nasaRef: 'Sibonga et al., Bone 2007; NASA HRP BHBR',
  history: generateHistory(1.04, MISSION_DAY, (d) => -0.00085 * d, 0.005),
};

const boneDensityHip: HealthMetric = {
  id: 'bmd_hip',
  name: 'Femoral Neck BMD',
  value: 0.88,
  unit: 'g/cm²',
  min: 0.65, max: 1.30,
  warnLow: 0.75, warnHigh: 1.25,
  baselineValue: 0.98,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Femoral neck is highest fracture-risk site in spaceflight. ~1.2%/month decline without adequate exercise. Post-flight recovery: 2–3 years.',
  nasaRef: 'Lang et al., JBMR 2004; Scott Kelly Year-in-Space (2019)',
  history: generateHistory(0.98, MISSION_DAY, (d) => -0.0007 * d, 0.005),
};

const muscleStrength: HealthMetric = {
  id: 'muscle_str',
  name: 'Lower Limb Strength',
  value: 71.4,
  unit: '% baseline',
  min: 50, max: 110,
  warnLow: 65, warnHigh: 108,
  baselineValue: 100,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Isokinetic lower limb peak torque as % of pre-flight baseline. Disuse atrophy in microgravity causes ~25% loss in 6 months without countermeasures.',
  nasaRef: 'Trappe et al., J Physiol (2004); HRP Exercise Physiology',
  history: generateHistory(100, MISSION_DAY, (d) => -0.198 * d, 0.01),
};

const spinalLength: HealthMetric = {
  id: 'spinal',
  name: 'Spinal Elongation',
  value: 102.8,
  unit: 'mm (Δ)',
  min: 95, max: 115,
  warnLow: 97, warnHigh: 112,
  baselineValue: 100,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Spinal elongation due to intervertebral disc expansion in microgravity (~3–5 cm increase). Associated with back pain in ~52% of ISS crew.',
  nasaRef: 'Johnston et al., Spine (2010); HRP IVD Risk',
  history: generateHistory(100, MISSION_DAY, (d) => 2.5 * (1 - Math.exp(-d / 30)), 0.005),
};

// ---- Immune System ----
// References: Crucian et al., J Interferon Cytokine Res (2008, 2013);
// Mehta et al., Psychosom Med (2000) — EBV reactivation, NK cell reduction

const whiteBloodCells: HealthMetric = {
  id: 'wbc',
  name: 'White Blood Cells',
  value: 7.8,
  unit: '×10³/μL',
  min: 2.0, max: 15.0,
  warnLow: 3.5, warnHigh: 11.0,
  baselineValue: 6.5,
  status: 'nominal',
  trend: 'fluctuating',
  lastUpdated: new Date(),
  description: 'Total WBC. Stress-induced leukocytosis is common. Persistent elevation may indicate viral reactivation (EBV, VZV, CMV). Watch for neutrophilia pattern.',
  nasaRef: 'Crucian et al., J Interferon Cytokine Res 2013',
  history: generateHistory(6.5, MISSION_DAY, (d) => 0.5 * Math.sin(d / 25) + 0.8, 0.05),
};

const nkCells: HealthMetric = {
  id: 'nk',
  name: 'NK Cell Activity',
  value: 61.2,
  unit: '% baseline',
  min: 30, max: 110,
  warnLow: 45, warnHigh: 105,
  baselineValue: 100,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Natural Killer cell cytotoxic activity. Spaceflight reduces NK function ~40% (stress + cortisol effect). Critical for tumor surveillance and viral control.',
  nasaRef: 'Crucian et al., 2008; Mehta et al. Psychosom Med 2000',
  history: generateHistory(100, MISSION_DAY, (d) => -0.27 * d + 5 * Math.sin(d / 30), 0.015),
};

const cortisol: HealthMetric = {
  id: 'cortisol',
  name: 'Salivary Cortisol',
  value: 18.4,
  unit: 'nmol/L',
  min: 2, max: 60,
  warnLow: 5, warnHigh: 35,
  baselineValue: 14.2,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Morning cortisol reflects HPA axis activity. Chronic elevation suppresses immune function. Spaceflight chronically elevates cortisol ~20–30% above Earth baseline.',
  nasaRef: 'Stahn et al., 2019; Smith et al., J Nutr 2012',
  history: generateHistory(14.2, MISSION_DAY, (d) => 2.5 + 1.5 * Math.sin(d / 40), 0.05),
};

const inflammatoryMarkers: HealthMetric = {
  id: 'crp',
  name: 'C-Reactive Protein',
  value: 2.1,
  unit: 'mg/L',
  min: 0, max: 15,
  warnLow: 0, warnHigh: 5.0,
  baselineValue: 0.8,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Systemic inflammation marker. Mildly elevated in many ISS crew (radiation + altered microbiome). Values >5 mg/L warrant medical evaluation.',
  nasaRef: 'Smith et al., J Nutr 2014; HRP Immunology Risk',
  history: generateHistory(0.8, MISSION_DAY, (d) => 0.009 * d + 0.3 * Math.random(), 0.1),
};

// ---- Behavioral & Mental Health ----
// References: Stuster et al., NASA TM-2010-216130; Kanas & Manzey (2008)
// Gushin et al. (2012); HERA analog studies

const sleepQuality: HealthMetric = {
  id: 'sleep',
  name: 'Sleep Quality Score',
  value: 68,
  unit: '/100',
  min: 20, max: 100,
  warnLow: 50, warnHigh: 100,
  baselineValue: 82,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Composite sleep score (actigraphy + sleep diary). ~75% of ISS crew report sleep disturbances. Melatonin circadian disruption due to 16 sunrises/day.',
  nasaRef: 'Barger et al., Lancet Neurol 2014; HRP Behavioral Health Risk',
  history: generateHistory(82, MISSION_DAY, (d) => -0.08 * d + 5 * Math.sin(d / 35), 0.03),
};

const cognitiveFatigue: HealthMetric = {
  id: 'cog_fatigue',
  name: 'Cognitive Performance',
  value: 74,
  unit: '/100',
  min: 30, max: 100,
  warnLow: 55, warnHigh: 100,
  baselineValue: 90,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Psychomotor vigilance task + spatial working memory composite. Sleep debt, isolation, and hypercapnia from CO₂ can impair cognition 20–30%.',
  nasaRef: 'Stuster 2010; Dinges et al., 2017; HERA Study IV',
  history: generateHistory(90, MISSION_DAY, (d) => -0.11 * d + 8 * Math.sin(d / 50), 0.025),
};

const moodScore: HealthMetric = {
  id: 'mood',
  name: 'Mood & Well-being',
  value: 71,
  unit: '/100',
  min: 20, max: 100,
  warnLow: 45, warnHigh: 100,
  baselineValue: 85,
  status: 'warning',
  trend: 'declining',
  lastUpdated: new Date(),
  description: 'Profile of Mood States (POMS) adapted. Third-quarter phenomenon documented in isolated missions: mood dip ~60-70% of mission duration.',
  nasaRef: 'Kanas & Manzey 2008; Gushin et al. 2012; HRP Behavioral Health',
  history: generateHistory(85, MISSION_DAY, (d) => {
    const thirdQ = d > 100 ? -15 : 0;
    return -0.07 * d + thirdQ + 5 * Math.sin(d / 30);
  }, 0.03),
};

const socialCohesion: HealthMetric = {
  id: 'social',
  name: 'Team Cohesion',
  value: 76,
  unit: '/100',
  min: 20, max: 100,
  warnLow: 50, warnHigh: 100,
  baselineValue: 88,
  status: 'nominal',
  trend: 'stable',
  lastUpdated: new Date(),
  description: 'Crew cohesion index. Displacement of negative emotion onto mission control is well-documented. Interpersonal conflict risk peaks at mission midpoint.',
  nasaRef: 'Stuster 2010; HERA Analog Mission Reports',
  history: generateHistory(88, MISSION_DAY, (d) => -0.09 * d + 6 * Math.sin(d / 45), 0.02),
};

// ---- Radiation ----
export const radiationData: RadiationData = {
  totalDose: 182.5,      // mGy accumulated (142-day mission at ~1.28 mGy/day ISS)
  dailyDose: 1.28,       // mGy/day ISS average (~0.5-2.0 range)
  limit: 1000,           // 1 Sv = 1000 mGy career limit (NCRP 132 / NASA occupational)
  percentUsed: 18.25,
  galacticCosmicRays: 148.3,
  solarParticleEvents: 34.2,
  history: generateHistory(0, MISSION_DAY, (d) => 1.28 * d, 0.02).map((p) => ({
    ...p,
    value: parseFloat((1.28 * p.day + (Math.random() - 0.5) * 2).toFixed(1))
  })),
};

// ---- Build Domain objects ----
export const healthDomains: HealthDomain[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: '❤️',
    description: 'Heart rate, blood pressure, aerobic capacity, and cardiac function monitoring. Microgravity causes fluid shift, plasma volume loss, and cardiac deconditioning.',
    overallStatus: 'warning',
    riskScore: 42,
    lastAssessment: new Date(),
    metrics: [heartRate, bloodPressureSys, bloodPressureDia, vo2max, cardiacOutput],
  },
  {
    id: 'bone-muscle',
    name: 'Bone & Muscle',
    icon: '🦴',
    description: 'Bone mineral density, muscle mass, and musculoskeletal integrity. Disuse atrophy and mechanical unloading cause progressive loss without countermeasures.',
    overallStatus: 'warning',
    riskScore: 58,
    lastAssessment: new Date(),
    metrics: [boneDensityLumbar, boneDensityHip, muscleStrength, spinalLength],
  },
  {
    id: 'immune',
    name: 'Immune System',
    icon: '🛡️',
    description: 'White blood cell counts, NK cell activity, inflammatory markers, and stress hormones. Space stress dysregulates immune function and reactivates latent viruses.',
    overallStatus: 'warning',
    riskScore: 35,
    lastAssessment: new Date(),
    metrics: [whiteBloodCells, nkCells, cortisol, inflammatoryMarkers],
  },
  {
    id: 'behavioral',
    name: 'Behavioral Health',
    icon: '🧠',
    description: 'Sleep quality, cognitive performance, mood, and team dynamics. Isolation, confinement, and monotony challenge psychological resilience on long missions.',
    overallStatus: 'warning',
    riskScore: 47,
    lastAssessment: new Date(),
    metrics: [sleepQuality, cognitiveFatigue, moodScore, socialCohesion],
  },
  {
    id: 'radiation',
    name: 'Radiation',
    icon: '☢️',
    description: 'Galactic cosmic ray dose, solar particle events, and accumulated career dose vs. occupational limits. DNA damage risk and cancer risk increase with cumulative exposure.',
    overallStatus: 'nominal',
    riskScore: 22,
    lastAssessment: new Date(),
    metrics: [
      {
        id: 'rad_total',
        name: 'Cumulative Dose',
        value: radiationData.totalDose,
        unit: 'mGy',
        min: 0, max: 1000,
        warnLow: 0, warnHigh: 500,
        baselineValue: 0,
        status: 'nominal',
        trend: 'stable',
        lastUpdated: new Date(),
        description: 'Total absorbed dose since mission start.',
        nasaRef: 'NCRP Report 132; NASA-STD-3001',
        history: radiationData.history,
      }
    ],
  },
];

export const astronautProfile: AstronautProfile = {
  id: 'ae-001',
  name: 'Col. Sarah Chen',
  rank: 'Commander',
  missionName: 'Artemis Gateway-1',
  missionDay: MISSION_DAY,
  missionDuration: 240,
  missionPhase: 'mid-mission',
  overallHealthScore: 71,
  criticalAlerts: 0,
  warnings: 7,
  lastCheckup: new Date(Date.now() - 86400000 * 2),
};

export const activeAlerts: Alert[] = [
  {
    id: 'a1',
    severity: 'warning',
    domain: 'Bone & Muscle',
    metric: 'VO₂ Max',
    message: 'Aerobic capacity has declined 16.7% from pre-flight baseline.',
    recommendation: 'Increase CEVIS cycle ergometer sessions to 60 min/day, 6 days/week. Target HR zone 2–3 (130–155 bpm).',
    timestamp: new Date(Date.now() - 3600000 * 6),
    acknowledged: false,
    nasaProtocol: 'HRP Exercise Countermeasures Protocol v4.2',
  },
  {
    id: 'a2',
    severity: 'warning',
    domain: 'Bone & Muscle',
    metric: 'Lumbar Bone Density',
    message: 'Lumbar BMD declined 12.5% from baseline — approaching warning threshold.',
    recommendation: 'Prioritize ARED resistance training. Ensure 1500 mg/day calcium + vitamin D supplement. Next DXA scan due Day 150.',
    timestamp: new Date(Date.now() - 3600000 * 24),
    acknowledged: false,
    nasaProtocol: 'HRP Bone Loss Countermeasure Protocol',
  },
  {
    id: 'a3',
    severity: 'warning',
    domain: 'Behavioral Health',
    metric: 'Sleep Quality',
    message: 'Sleep quality score trending downward — 17% decline over 30 days. Third-quarter phenomenon detected.',
    recommendation: 'Initiate sleep hygiene protocol: light therapy (10,000 lux) in AM, 0.5 mg melatonin 1h before sleep, maintain strict sleep schedule.',
    timestamp: new Date(Date.now() - 3600000 * 12),
    acknowledged: false,
    nasaProtocol: 'HRP Behavioral Health: Sleep Countermeasure SOP',
  },
  {
    id: 'a4',
    severity: 'warning',
    domain: 'Immune',
    metric: 'NK Cell Activity',
    message: 'Natural killer cell cytotoxic activity reduced 38.8% from baseline.',
    recommendation: 'Monitor for viral reactivation symptoms (shingles rash, cold sores). Consider prophylactic antiviral if EBV IgG rises. Stress management priority.',
    timestamp: new Date(Date.now() - 3600000 * 36),
    acknowledged: true,
    nasaProtocol: 'HRP Immunology: Viral Reactivation SOP',
  },
  {
    id: 'a5',
    severity: 'warning',
    domain: 'Cardiovascular',
    metric: 'VO₂ Max',
    message: 'Cognitive performance 17.8% below baseline. Elevated CO₂ or sleep debt suspected.',
    recommendation: 'Check CO₂ levels in hab module. Cognitive tests (PVT) daily this week. If sleep debt: enforce 8h sleep window for 7 days.',
    timestamp: new Date(Date.now() - 3600000 * 8),
    acknowledged: false,
    nasaProtocol: 'HRP Cognitive Performance SOP; CO₂ Monitoring Protocol',
  },
];

export const actionItems: ActionItem[] = [
  {
    id: 'act1',
    priority: 'high',
    domain: 'Bone & Muscle',
    action: 'Complete ARED resistance training session (lower body focus)',
    protocol: 'HRP Exercise Protocol — ARED v3.1',
    dueDay: MISSION_DAY,
    completed: false,
  },
  {
    id: 'act2',
    priority: 'high',
    domain: 'Cardiovascular',
    action: 'CEVIS ergometer 60 min at Zone 2 (130–145 bpm)',
    protocol: 'CEVIS ISS Protocol',
    dueDay: MISSION_DAY,
    completed: true,
  },
  {
    id: 'act3',
    priority: 'medium',
    domain: 'Behavioral Health',
    action: 'Complete Psychomotor Vigilance Task (10-min PVT)',
    protocol: 'Cognition App Battery',
    dueDay: MISSION_DAY,
    completed: false,
  },
  {
    id: 'act4',
    priority: 'medium',
    domain: 'Immune',
    action: 'Collect saliva sample for EBV viral load & cortisol assay',
    protocol: 'HRP Immunology Collection Kit SOP',
    dueDay: MISSION_DAY + 1,
    completed: false,
  },
  {
    id: 'act5',
    priority: 'medium',
    domain: 'Bone & Muscle',
    action: 'Take calcium + Vitamin D3 supplement (1500 mg / 2000 IU)',
    protocol: 'HRP Nutritional Countermeasures',
    dueDay: MISSION_DAY,
    completed: true,
  },
  {
    id: 'act6',
    priority: 'low',
    domain: 'Behavioral Health',
    action: 'Weekly crew cohesion check-in with Mission Control psychologist',
    protocol: 'BHP Monthly Behavioral Health Assessment',
    dueDay: MISSION_DAY + 2,
    completed: false,
  },
  {
    id: 'act7',
    priority: 'high',
    domain: 'Behavioral Health',
    action: 'Light therapy session — 20 min, 10,000 lux upon waking',
    protocol: 'HRP Sleep Countermeasure SOP',
    dueDay: MISSION_DAY,
    completed: false,
  },
];

export const selfAssessments: SelfAssessment[] = [
  {
    id: 'sa1',
    date: new Date(Date.now() - 86400000 * 7),
    missionDay: MISSION_DAY - 7,
    domainId: 'behavioral',
    score: 72,
    status: 'warning',
    notes: 'Noticeable fatigue increasing. Sleep schedule disrupted during EVA preparation week.',
    responses: [
      { questionId: 'q1', question: 'How well did you sleep last night?', value: 2, category: 'sleep' },
      { questionId: 'q2', question: 'How would you rate your energy level today?', value: 3, category: 'energy' },
      { questionId: 'q3', question: 'How focused do you feel on tasks?', value: 3, category: 'cognition' },
      { questionId: 'q4', question: 'How is your mood today?', value: 3, category: 'mood' },
    ],
  },
];
