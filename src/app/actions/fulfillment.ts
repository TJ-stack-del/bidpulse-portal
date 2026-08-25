'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type FulfillmentStatus = 'drafting' | 'qa_review' | 'ready_for_export' | 'delivered';

export async function updateProposalStage(
  id: string,
  status: FulfillmentStatus,
  notes?: string | null
) {
  const updatePayload: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (notes !== undefined) {
    updatePayload.notes = notes;
  }

  const { error } = await supabaseAdmin
    .from('proposal_requests')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    console.error('Failed to update proposal stage:', error);
    throw new Error(`Failed to update proposal stage: ${error.message}`);
  }

  // Invalidate both routes so changes show up live
  revalidatePath('/portal/proposals');
  revalidatePath('/portal/coordinator');
  revalidatePath('/binders');
  return { success: true };
}