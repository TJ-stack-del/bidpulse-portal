'use server'

import { createClient } from '@/lib/supabaseServer'; 
import { revalidatePath } from 'next/cache';

export async function createIntakeAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Zero-Trust Auth Check on the Server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized: Active session required.');
  }

  // 2. Bundle extra attributes into the raw_payload JSON column
  const rawPayloadData = {
    legalName: formData.get('legalName'),
    fein: formData.get('fein'),
    sunbizNumber: formData.get('sunbizNumber'),
    licenseNumber: formData.get('licenseNumber'),
    primaryTrade: formData.get('primaryTrade'),
    insuranceCoverage: formData.get('insuranceCoverage'),
    bondingCapacity: formData.get('bondingCapacity'),
  };

  const intakePayload = {
    user_id: user.id,
    solicitation_title: formData.get('selectedSolicitation') as string,
    issuing_agency: 'Duval County Public Procurement',
    status: 'draft',
    current_step_index: 1,
    raw_payload: rawPayloadData, // Maps directly to your JSON column
  };

  // 3. Execute Secure Server-Side Insert
  const { error } = await (supabase.from('proposal_requests') as any)
    .insert(intakePayload);

  if (error) {
    console.error('Insert Error:', error);
    throw new Error(`DB Error: ${error.message} (Details: ${error.details || 'None'})`);
  }

// 4. Invalidate the router cache and redirect properly
  revalidatePath('/portal/coordinator');
  
  return { success: true };
}