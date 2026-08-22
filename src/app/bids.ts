import { supabase } from "./supabase";

export interface ScoringBreakdown {
  certifications: number;
  pastPerformance: number;
  laborCapacity: number;
  equipmentReadiness: number;
}

export interface SupportTicket {
  id: string;
  type: "Addendum Upload" | "Timeline Clarification" | "Pricing Adjustment" | "General";
  message: string;
  createdAt: string;
}

export interface BidItem {
  id: string;
  title: string;
  agency: string;
  dueDate: string;
  status: "Drafting" | "Review" | "Submitted";
  fitScore: number;
  estimatedValue?: string;
  scope?: string;
  scoringBreakdown?: ScoringBreakdown;
  tickets?: SupportTicket[];
}

export interface IntakeDraft {
  title: string;
  agency: string;
  dueDate: string;
  estimatedValue: string;
  scope: string;
  savedAt: string;
}

export const initialBids: BidItem[] = [
  {
    id: "BID-101",
    title: "Facilities Maintenance & Sanitation Services",
    agency: "Duval County Public Schools",
    dueDate: "2026-09-15",
    status: "Drafting",
    fitScore: 92,
    estimatedValue: "$180,000",
    scope: "Daily custodial operations, floor maintenance, and sanitation across district facilities.",
    scoringBreakdown: {
      certifications: 25,
      pastPerformance: 25,
      laborCapacity: 22,
      equipmentReadiness: 20
    },
    tickets: []
  },
  {
    id: "BID-102",
    title: "Commercial Janitorial & Daily Custodial",
    agency: "City of Jacksonville",
    dueDate: "2026-09-22",
    status: "Review",
    fitScore: 88,
    estimatedValue: "$250,000",
    scope: "Comprehensive daily office cleaning, trash removal, and restroom sanitization.",
    scoringBreakdown: {
      certifications: 25,
      pastPerformance: 20,
      laborCapacity: 23,
      equipmentReadiness: 20
    },
    tickets: []
  },
  {
    id: "BID-103",
    title: "Quarterly Deep Clean & Floor Care",
    agency: "JTA Transit Authority",
    dueDate: "2026-10-05",
    status: "Submitted",
    fitScore: 68,
    estimatedValue: "$95,000",
    scope: "Quarterly high-frequency carpet extraction and hard-surface machine scrubbing.",
    scoringBreakdown: {
      certifications: 15,
      pastPerformance: 15,
      laborCapacity: 20,
      equipmentReadiness: 18
    },
    tickets: []
  }
];

export async function fetchAllBidsFromCloud(): Promise<BidItem[]> {
  try {
    const { data: bidsData, error: bidsError } = await supabase
      .from("bids")
      .select("*")
      .order("created_at", { ascending: false });

    if (bidsError || !bidsData || bidsData.length === 0) {
      return getSavedBids();
    }

    const { data: ticketsData } = await supabase.from("support_tickets").select("*");

    const mapped: BidItem[] = bidsData.map((b) => {
      const relatedTickets = (ticketsData || [])
        .filter((t) => t.bid_id === b.id)
        .map((t) => ({
          id: t.id,
          type: t.type as SupportTicket["type"],
          message: t.message,
          createdAt: t.created_at
        }));

      return {
        id: b.id,
        title: b.title,
        agency: b.agency,
        dueDate: b.due_date,
        status: b.status as BidItem["status"],
        fitScore: b.fit_score,
        estimatedValue: b.estimated_value,
        scope: b.scope,
        scoringBreakdown: b.scoring_breakdown,
        tickets: relatedTickets
      };
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("bidpulse_bids", JSON.stringify(mapped));
    }
    return mapped;
  } catch (err) {
    return getSavedBids();
  }
}

export function getSavedBids(): BidItem[] {
  if (typeof window === "undefined") return initialBids;
  const stored = localStorage.getItem("bidpulse_bids");
  if (stored === null) {
    localStorage.setItem("bidpulse_bids", JSON.stringify(initialBids));
    return initialBids;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function getBidById(id: string): BidItem | undefined {
  const all = getSavedBids();
  return all.find((b) => b.id === id);
}

export function saveNewBid(newBid: BidItem) {
  const current = getSavedBids();
  const updated = [newBid, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
  }

  supabase.from("bids").insert({
    id: newBid.id,
    title: newBid.title,
    agency: newBid.agency,
    due_date: newBid.dueDate,
    status: newBid.status,
    fit_score: newBid.fitScore,
    estimated_value: newBid.estimatedValue,
    scope: newBid.scope,
    scoring_breakdown: newBid.scoringBreakdown
  }).then();
}

export const saveBid = saveNewBid;

export function updateBidDetails(id: string, updates: Partial<BidItem>) {
  const current = getSavedBids();
  const updated = current.map((bid) => (bid.id === id ? { ...bid, ...updates } : bid));
  if (typeof window !== "undefined") {
    localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
  }

  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.fitScore) payload.fit_score = updates.fitScore;
  if (updates.estimatedValue) payload.estimated_value = updates.estimatedValue;
  if (updates.scope) payload.scope = updates.scope;
  if (updates.scoringBreakdown) payload.scoring_breakdown = updates.scoringBreakdown;

  supabase.from("bids").update(payload).eq("id", id).then();
}

export function updateBidScore(id: string, fitScore: number, scoringBreakdown?: ScoringBreakdown) {
  updateBidDetails(id, { fitScore, scoringBreakdown });
}

export function addSupportTicket(bidId: string, ticket: Omit<SupportTicket, "id" | "createdAt">) {
  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toLocaleString();
  const newTicket: SupportTicket = { ...ticket, id: ticketId, createdAt };

  const current = getSavedBids();
  const updated = current.map((bid) => {
    if (bid.id === bidId) {
      const existing = bid.tickets || [];
      return { ...bid, tickets: [newTicket, ...existing] };
    }
    return bid;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
  }

  supabase.from("support_tickets").insert({
    id: ticketId,
    bid_id: bidId,
    type: ticket.type,
    message: ticket.message,
    created_at: createdAt
  }).then();
}

export function purgeAllTestData() {
  if (typeof window !== "undefined") {
    localStorage.setItem("bidpulse_bids", JSON.stringify([]));
    localStorage.removeItem("bidpulse_intake_draft");
  }
  supabase.from("support_tickets").delete().neq("id", "none").then();
  supabase.from("bids").delete().neq("id", "none").then();
}

export function resetToSampleData() {
  if (typeof window !== "undefined") {
    localStorage.setItem("bidpulse_bids", JSON.stringify(initialBids));
  }
}

export function getSavedDraft(): IntakeDraft | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("bidpulse_intake_draft");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function saveDraft(draft: Omit<IntakeDraft, "savedAt">) {
  if (typeof window === "undefined") return;
  const data: IntakeDraft = {
    ...draft,
    savedAt: new Date().toLocaleTimeString()
  };
  localStorage.setItem("bidpulse_intake_draft", JSON.stringify(data));
}

export function clearSavedDraft() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bidpulse_intake_draft");
  }
}
