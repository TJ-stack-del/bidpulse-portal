'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type IntakeStatus = 'in_review' | 'approved' | 'rejected';

export async function updateIntakeStatus(
  id: string,
  status: IntakeStatus,
  targetDate?: string | null,
  notes?: string | null
) {
  const updatePayload: Record<string, any> = { status };
  if (targetDate !== undefined) updatePayload.target_date = targetDate;
  if (notes !== undefined) updatePayload.notes = notes;

  const { data: updatedIntake, error: updateError } = await supabaseAdmin
    .from('rfp_intakes')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Failed to update rfp_intake:', updateError);
    throw new Error(`Failed to update intake: ${updateError.message}`);
  }

  // Auto-provision proposal request upon approval
  if (status === 'approved' && updatedIntake) {
    const rawData = updatedIntake.raw_payload || {};
    const customerEmail =
      rawData.customer_details?.email ||
      rawData.customer_email ||
      'client@unassigned.com';

    const insertPayload: Record<string, any> = {
      intake_id: updatedIntake.id,
      user_id: updatedIntake.user_id || null,
      solicitation_title: rawData.solicitation_title || rawData.title || `Intake RFP - ${updatedIntake.id.slice(0, 8)}`,
      issuing_agency: rawData.issuing_agency || rawData.agency || 'Unspecified Agency',
      status: 'drafting',
      tier: updatedIntake.tier || 'single_bid_pass',
      target_date: targetDate || updatedIntake.target_date || null,
      notes: notes || updatedIntake.notes || null,
      client_email: customerEmail,
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabaseAdmin
      .from('proposal_requests')
      .insert(insertPayload);

    if (insertError) {
      console.error('Failed to insert into proposal_requests:', insertError);
      throw new Error(`Failed to create proposal request: ${insertError.message}`);
    }
  }

  revalidatePath('/portal/coordinator');
  revalidatePath('/admin/fulfillment');
  return { success: true };
}