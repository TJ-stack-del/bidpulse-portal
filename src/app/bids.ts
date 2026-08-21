export interface BidItem {
  id: string;
  title: string;
  agency: string;
  dueDate: string;
  status: "Drafting" | "Review" | "Submitted";
  fitScore: number;
  estimatedValue?: string;
  scope?: string;
  scoringBreakdown?: {
    certifications: number;
    pastPerformance: number;
    laborCapacity: number;
    equipmentReadiness: number;
  };
}

export const INITIAL_BIDS: BidItem[] = [
  { 
    id: "BID-101", 
    title: "Facilities Maintenance & Sanitation Services", 
    agency: "Duval County Public Schools", 
    dueDate: "2026-09-15", 
    status: "Drafting", 
    fitScore: 92, 
    estimatedValue: "$180,000",
    scoringBreakdown: { certifications: 95, pastPerformance: 90, laborCapacity: 90, equipmentReadiness: 95 }
  },
  { 
    id: "BID-102", 
    title: "Commercial Janitorial & Daily Custodial", 
    agency: "City of Jacksonville", 
    dueDate: "2026-09-22", 
    status: "Review", 
    fitScore: 88, 
    estimatedValue: "$250,000",
    scoringBreakdown: { certifications: 85, pastPerformance: 90, laborCapacity: 85, equipmentReadiness: 90 }
  },
  { 
    id: "BID-103", 
    title: "Quarterly Deep Clean & Floor Care", 
    agency: "JTA Transit Authority", 
    dueDate: "2026-10-01", 
    status: "Submitted", 
    fitScore: 79, 
    estimatedValue: "$95,000",
    scoringBreakdown: { certifications: 75, pastPerformance: 80, laborCapacity: 80, equipmentReadiness: 80 }
  },
];

export function getSavedBids(): BidItem[] {
  if (typeof window === "undefined") return INITIAL_BIDS;
  const data = localStorage.getItem("bidpulse_bids");
  return data ? JSON.parse(data) : INITIAL_BIDS;
}

export function getBidById(id: string): BidItem | undefined {
  const bids = getSavedBids();
  return bids.find((b) => b.id === id);
}

export function saveBid(newBid: BidItem): void {
  if (typeof window === "undefined") return;
  const current = getSavedBids();
  const updated = [newBid, ...current];
  localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
}

export function updateBidScore(id: string, score: number, breakdown: BidItem["scoringBreakdown"]): void {
  if (typeof window === "undefined") return;
  const bids = getSavedBids();
  const updated = bids.map((b) => (b.id === id ? { ...b, fitScore: score, scoringBreakdown: breakdown } : b));
  localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
}