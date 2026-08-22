import { supabase } from "./supabase";

export interface ClientProfile {
  companyName: string;
  naicsCodes: string[];
  preferredAgencies: string[];
  minBudget: number;
  maxBudget: number;
  capabilities: string[];
}

export const DEFAULT_PROFILE: ClientProfile = {
  companyName: "First Coast Facilities Group",
  naicsCodes: ["561720"],
  preferredAgencies: [
    "City of Jacksonville",
    "Duval County Public Schools",
    "JTA",
    "Department of the Navy"
  ],
  minBudget: 50000,
  maxBudget: 1000000,
  capabilities: [
    "Daily Commercial Janitorial",
    "Floor Stripping & Waxing",
    "Sanitization & Disinfection",
    "Carpet Extraction",
    "Pressure Washing"
  ]
};

const STORAGE_KEY = "bidpulse_client_profile";

export function getClientProfile(): ClientProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveClientProfile(profile: ClientProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  supabase.from("client_profiles").upsert({
    id: "primary_contractor",
    company_name: profile.companyName,
    naics_codes: profile.naicsCodes,
    preferred_agencies: profile.preferredAgencies,
    min_budget: profile.minBudget,
    max_budget: profile.maxBudget,
    capabilities: profile.capabilities
  }).then();
}

export function calculateMatchScore(
  item: { naicsCode: string; agency: string; estimatedValue: string; scope: string },
  profile: ClientProfile
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // NAICS match (+35 pts)
  const hasNaicsMatch = profile.naicsCodes.some((code) =>
    item.naicsCode.includes(code)
  );
  if (hasNaicsMatch) {
    score += 35;
    reasons.push("Direct NAICS Trade Alignment");
  }

  // Preferred Agency match (+30 pts)
  const hasAgencyMatch = profile.preferredAgencies.some((agency) =>
    item.agency.toLowerCase().includes(agency.toLowerCase())
  );
  if (hasAgencyMatch) {
    score += 30;
    reasons.push("Target Municipal/Regional Agency");
  }

  // Budget Capacity match (+20 pts)
  const numericVal = parseInt(item.estimatedValue.replace(/[^0-9]/g, ""), 10);
  if (!isNaN(numericVal)) {
    if (numericVal >= profile.minBudget && numericVal <= profile.maxBudget) {
      score += 20;
      reasons.push("Optimal Contract Size Tier");
    } else if (numericVal < profile.minBudget) {
      score += 5;
    }
  } else {
    score += 10;
  }

  // Capability Keyword match (+15 pts)
  const hasCapMatch = profile.capabilities.some((cap) =>
    item.scope.toLowerCase().includes(cap.toLowerCase())
  );
  if (hasCapMatch) {
    score += 15;
    reasons.push("Matches Stated Service Capabilities");
  }

  return { score: Math.min(100, score), reasons };
}
