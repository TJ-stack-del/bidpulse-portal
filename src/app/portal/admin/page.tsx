import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Command Center</h1>
      
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div className="border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-white">System Access Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            View and manage role-based access for all registered users.
          </p>
        </div>
        
        {/* We will wire this table up to the database next! */}
        <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-lg">
          <p className="text-slate-500">
            User Management interface coming online...
          </p>
        </div>
      </div>
    </div>
  );
}