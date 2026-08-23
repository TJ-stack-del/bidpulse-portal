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

export async function updateRequestStatus(
  requestId: string,
  newStatus: string,
  packetUrl?: string
) {
  const supabaseAdmin = getAdminClient();

  const updatePayload: Record<string, any> = { status: newStatus };
  if (packetUrl !== undefined) {
    updatePayload.delivered_packet_url = packetUrl;
  }

  const { error } = await supabaseAdmin
    .from('package_requests')
    .update(updatePayload)
    .eq('id', requestId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/requests');
  revalidatePath('/opportunities');
}
