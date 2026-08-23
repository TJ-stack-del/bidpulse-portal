'use client';

import React, { useState, useEffect } from 'react';

interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  companyName: string;
  role: 'client' | 'specialist' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    displayName: '',
    companyName: '',
    role: 'client'
  });

  const [editState, setEditState] = useState<{ [id: string]: { displayName: string; companyName: string; role: 'client' | 'specialist' | 'admin' } }>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        const initialEdits: any = {};
        data.users.forEach((u: UserRecord) => {
          initialEdits[u.id] = { displayName: u.displayName, companyName: u.companyName, role: u.role };
        });
        setEditState(initialEdits);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (userId: string) => {
    setSavingId(userId);
    try {
      const current = editState[userId];
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role: current.role,
          displayName: current.displayName,
          companyName: current.companyName
        })
      });

      if (!res.ok) throw new Error('Save failed');
      await fetchUsers();
      alert('User updated successfully');
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          ...inviteForm
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to send invite');

      alert(`Invitation sent to ${inviteForm.email}`);
      setShowInviteModal(false);
      setInviteForm({ email: '', displayName: '', companyName: '', role: 'client' });
      await fetchUsers();
    } catch (err: any) {
      alert(`Invite error: ${err.message}`);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Bid<span className="text-blue-500">Pulse</span> Console
            </h1>
            <p className="text-slate-400 text-sm">User Directory, Role Controls & Invitations</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchUsers} 
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded border border-slate-700 transition"
            >
              Refresh
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded transition shadow-md flex items-center gap-1.5"
            >
              <span>+</span> Invite Contractor
            </button>
          </div>
        </div>

        {/* Modal for User Invites */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Send Client / Staff Invite</h3>
              <p className="text-xs text-slate-400 mb-6">Supabase will send an activation email directly to their inbox.</p>
              
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Full Name</label>
                  <input 
                    required 
                    value={inviteForm.displayName}
                    onChange={(e) => setInviteForm({ ...inviteForm, displayName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Company Legal Name</label>
                  <input 
                    value={inviteForm.companyName}
                    onChange={(e) => setInviteForm({ ...inviteForm, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-1">Initial Role</label>
                  <select 
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
                  >
                    <option value="client">Client (Contractor)</option>
                    <option value="specialist">Specialist (Reviewer)</option>
                    <option value="admin">Admin (Full Access)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={inviting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded disabled:opacity-50"
                  >
                    {inviting ? 'Dispatching...' : 'Send Magic Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading user records...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Email</th>
                  <th className="p-4">Display Name</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Permission Tier</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono text-xs text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <input 
                        value={editState[user.id]?.displayName || ''} 
                        onChange={(e) => setEditState({
                          ...editState,
                          [user.id]: { ...editState[user.id], displayName: e.target.value }
                        })}
                        className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white w-full max-w-[180px] focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        value={editState[user.id]?.companyName || ''} 
                        onChange={(e) => setEditState({
                          ...editState,
                          [user.id]: { ...editState[user.id], companyName: e.target.value }
                        })}
                        className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white w-full max-w-[180px] focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <select 
                        value={editState[user.id]?.role || 'client'} 
                        onChange={(e) => setEditState({
                          ...editState,
                          [user.id]: { ...editState[user.id], role: e.target.value as any }
                        })}
                        className={`border rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                          editState[user.id]?.role === 'admin'
                            ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                            : editState[user.id]?.role === 'specialist'
                            ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                            : 'bg-slate-950 border-slate-700 text-slate-300'
                        }`}
                      >
                        <option value="client">Client (Contractor)</option>
                        <option value="specialist">Specialist (Reviewer)</option>
                        <option value="admin">Admin (Full Control)</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleSave(user.id)}
                        disabled={savingId === user.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition disabled:opacity-50"
                      >
                        {savingId === user.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
