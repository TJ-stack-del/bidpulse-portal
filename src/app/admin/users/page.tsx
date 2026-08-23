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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Non-JSON response from server:', text);
        setUsers([]);
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data.users)) {
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

  const handleDelete = async (user: UserRecord) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${user.email}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingId(user.id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      alert('User deleted successfully');
      await fetchUsers();
    } catch (err: any) {
      alert(`Delete notice: ${err.message}`);
    } finally {
      setDeletingId(null);
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

      alert(`Invitation dispatched to ${inviteForm.email}`);
      setShowInviteModal(false);
      setInviteForm({ email: '', displayName: '', companyName: '', role: 'client' });
      await fetchUsers();
    } catch (err: any) {
      alert(`Invite notice: ${err.message}`);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
            User Directory & Access Control
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage contractor records, internal staff permissions, and invites.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchUsers} 
            className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition"
          >
            Refresh
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2 rounded-lg transition shadow-md flex items-center gap-1.5"
          >
            <span>+</span> Invite Contractor
          </button>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Invite New Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Dispatches an activation link to the contractor's email address.</p>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <input 
                  required 
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Contact Name</label>
                <input 
                  required 
                  value={inviteForm.displayName}
                  onChange={(e) => setInviteForm({ ...inviteForm, displayName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Company Name</label>
                <input 
                  value={inviteForm.companyName}
                  onChange={(e) => setInviteForm({ ...inviteForm, companyName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Access Role</label>
                <select 
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="client">Client (Contractor)</option>
                  <option value="specialist">Specialist (Reviewer)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={inviting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading user accounts...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4">Account Email</th>
                <th className="p-4">Contact Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Permission Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <input 
                      value={editState[user.id]?.displayName ?? ''} 
                      onChange={(e) => setEditState({
                        ...editState,
                        [user.id]: { ...editState[user.id], displayName: e.target.value }
                      })}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-white w-full max-w-[180px] focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      value={editState[user.id]?.companyName ?? ''} 
                      onChange={(e) => setEditState({
                        ...editState,
                        [user.id]: { ...editState[user.id], companyName: e.target.value }
                      })}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-white w-full max-w-[180px] focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <select 
                      value={editState[user.id]?.role || 'client'} 
                      onChange={(e) => setEditState({
                        ...editState,
                        [user.id]: { ...editState[user.id], role: e.target.value as any }
                      })}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="client">Client (Contractor)</option>
                      <option value="specialist">Specialist (Reviewer)</option>
                      <option value="admin">Admin (Full Control)</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleSave(user.id)}
                      disabled={savingId === user.id || deletingId === user.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition disabled:opacity-50"
                    >
                      {savingId === user.id ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id || savingId === user.id}
                      className="bg-rose-600/10 hover:bg-rose-600 border border-rose-500/30 text-rose-500 hover:text-white font-semibold text-xs px-3 py-1.5 rounded transition disabled:opacity-50"
                    >
                      {deletingId === user.id ? 'Removing...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
