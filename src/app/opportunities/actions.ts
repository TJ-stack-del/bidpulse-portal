'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY || 'placeholder-service-key';

  return createClient(supabaseUrl, supabaseSecret);
}

export async function requestProposalPackage(solicitationId: string, userId: string) {
  const supabaseAdmin = getAdminClient();

  // Check if a request already exists for this user and solicitation
  const { data: existing } = await supabaseAdmin
    .from('package_requests')
    .select('id')
    .eq('solicitation_id', solicitationId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    throw new Error('You have already submitted a package request for this opportunity.');
  }

  const { error } = await supabaseAdmin.from('package_requests').insert({
    solicitation_id: solicitationId,
    user_id: userId,
    status: 'requested',
    package_fee: 495.00,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/opportunities');
  revalidatePath('/admin/requests');
}
