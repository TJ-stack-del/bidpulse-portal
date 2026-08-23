import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError && authError) {
      return NextResponse.json({ users: [] });
    }

    if (authData?.users && authData.users.length > 0) {
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const userList = authData.users.map(u => {
        const prof = profileMap.get(u.id);
        return {
          id: u.id,
          email: u.email || 'No email',
          displayName: u.user_metadata?.full_name || prof?.full_name || 'No Name Set',
          companyName: u.user_metadata?.company_name || prof?.company_name || '—',
          role: prof?.role || 'client',
          createdAt: u.created_at
        };
      });

      return NextResponse.json({ users: userList });
    }

    const fallbackList = (profiles || []).map(p => ({
      id: p.id,
      email: p.email || 'contractor@bidpulse.local',
      displayName: p.full_name || p.display_name || 'Active User',
      companyName: p.company_name || '—',
      role: p.role || 'client',
      createdAt: p.created_at || new Date().toISOString()
    }));

    return NextResponse.json({ users: fallbackList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, users: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    if (body.action === 'invite') {
      const { email, role, displayName, companyName } = body;

      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name: displayName, company_name: companyName }
      });

      if (inviteError) throw inviteError;

      if (inviteData?.user) {
        await supabase.from('profiles').upsert({
          id: inviteData.user.id,
          email: inviteData.user.email,
          role: role || 'client',
          full_name: displayName,
          company_name: companyName
        });
      }

      return NextResponse.json({ success: true, message: 'Invite sent' });
    }

    const { userId, role, displayName, companyName } = body;

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: role,
        full_name: displayName,
        company_name: companyName
      });

    if (profileError) throw profileError;

    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: displayName, company_name: companyName }
      });
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Delete associated profile record
    await supabase.from('profiles').delete().eq('id', userId);

    // 2. Delete user from auth engine
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
    if (authDeleteError) throw authDeleteError;

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete operation failed' }, { status: 500 });
  }
}
