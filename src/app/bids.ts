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
  documentUrl?: string;
  documentName?: string;
  userId?: string;
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

export async function uploadRfpDocument(file: File): Promise<{ url: string; name: string } | null> {
  try {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `solicitations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("rfp-documents")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.warn("Storage upload error:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("rfp-documents").getPublicUrl(filePath);
    return { url: data.publicUrl, name: file.name };
  } catch (err) {
    console.warn("Storage exception:", err);
    return null;
  }
}

export async function fetchUserBidsFromCloud(userId?: string): Promise<BidItem[]> {
  try {
    let query = supabase.from("bids").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: bidsData, error: bidsError } = await query;

    if (bidsError || !bidsData) {
      return getSavedBids(userId);
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
        documentUrl: b.document_url,
        documentName: b.document_name,
        userId: b.user_id,
        scoringBreakdown: b.scoring_breakdown,
        tickets: relatedTickets
      };
    });

    if (typeof window !== "undefined" && userId) {
      localStorage.setItem(`bidpulse_bids_${userId}`, JSON.stringify(mapped));
    }
    return mapped;
  } catch (err) {
    return getSavedBids(userId);
  }
}

export function getSavedBids(userId?: string): BidItem[] {
  if (typeof window === "undefined" || !userId) return [];
  const stored = localStorage.getItem(`bidpulse_bids_${userId}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function getBidById(id: string, userId?: string): BidItem | undefined {
  const all = getSavedBids(userId);
  return all.find((b) => b.id === id);
}

export function saveNewBid(newBid: BidItem, userId?: string) {
  if (!userId) return;
  const bidWithUser = { ...newBid, userId };
  const current = getSavedBids(userId);
  const updated = [bidWithUser, ...current.filter(b => b.id !== newBid.id)];
  
  if (typeof window !== "undefined") {
    localStorage.setItem(`bidpulse_bids_${userId}`, JSON.stringify(updated));
  }

  supabase.from("bids").insert({
    id: newBid.id,
    user_id: userId,
    title: newBid.title,
    agency: newBid.agency,
    due_date: newBid.dueDate,
    status: newBid.status,
    fit_score: newBid.fitScore,
    estimated_value: newBid.estimatedValue,
    scope: newBid.scope,
    document_url: newBid.documentUrl,
    document_name: newBid.documentName,
    scoring_breakdown: newBid.scoringBreakdown
  }).then();
}

export const saveBid = saveNewBid;

export function updateBidDetails(id: string, updates: Partial<BidItem>, userId?: string) {
  if (!userId) return;
  const current = getSavedBids(userId);
  const updated = current.map((bid) => (bid.id === id ? { ...bid, ...updates } : bid));
  if (typeof window !== "undefined") {
    localStorage.setItem(`bidpulse_bids_${userId}`, JSON.stringify(updated));
  }

  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.fitScore !== undefined) payload.fit_score = updates.fitScore;
  if (updates.estimatedValue !== undefined) payload.estimated_value = updates.estimatedValue;
  if (updates.scope !== undefined) payload.scope = updates.scope;
  if (updates.documentUrl !== undefined) payload.document_url = updates.documentUrl;
  if (updates.documentName !== undefined) payload.document_name = updates.documentName;
  if (updates.scoringBreakdown !== undefined) payload.scoring_breakdown = updates.scoringBreakdown;

  supabase.from("bids").update(payload).eq("id", id).then();
}

export function updateBidScore(id: string, fitScore: number, scoringBreakdown?: ScoringBreakdown, userId?: string) {
  updateBidDetails(id, { fitScore, scoringBreakdown }, userId);
}

export function addSupportTicket(bidId: string, ticket: Omit<SupportTicket, "id" | "createdAt">, userId?: string) {
  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toLocaleString();
  const newTicket: SupportTicket = { ...ticket, id: ticketId, createdAt };

  if (userId) {
    const current = getSavedBids(userId);
    const updated = current.map((bid) => {
      if (bid.id === bidId) {
        const existing = bid.tickets || [];
        return { ...bid, tickets: [newTicket, ...existing] };
      }
      return bid;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(`bidpulse_bids_${userId}`, JSON.stringify(updated));
    }
  }

  supabase.from("support_tickets").insert({
    id: ticketId,
    bid_id: bidId,
    type: ticket.type,
    message: ticket.message,
    created_at: createdAt
  }).then();
}

export function purgeAllTestData(userId?: string) {
  if (typeof window !== "undefined" && userId) {
    localStorage.removeItem(`bidpulse_bids_${userId}`);
    localStorage.removeItem("bidpulse_intake_draft");
  }
  if (userId) {
    supabase.from("bids").delete().eq("user_id", userId).then();
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

export const resetToSampleData = async () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};

// Backward compatibility aliases
export const fetchAllBidsFromCloud = fetchUserBidsFromCloud;