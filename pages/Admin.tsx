import React from 'react';
import { User } from '../types';
import { SectionHeader, GlassCard } from '../components/UI';
import { BARBERS } from '../constants';

export const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="min-h-screen bg-darkveil-950 p-6 text-white">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold">Manager Portal</h1>
         <div className="px-3 py-1 bg-red-900/50 border border-red-500/30 rounded text-red-200 text-xs font-bold tracking-wider">
           ADMIN ACCESS
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard className="p-4">
          <h3 className="text-gray-400 text-sm">Today's Revenue</h3>
          <p className="text-2xl font-bold mt-1">$1,240</p>
        </GlassCard>
        <GlassCard className="p-4">
          <h3 className="text-gray-400 text-sm">Appointments</h3>
          <p className="text-2xl font-bold mt-1">24</p>
        </GlassCard>
      </div>

      <SectionHeader title="Team Status" />
      <div className="space-y-4">
        {BARBERS.map(barber => (
           <GlassCard key={barber.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={barber.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt="Avatar" />
                <div>
                   <h4 className="font-bold">{barber.name}</h4>
                   <span className="text-xs text-green-400">● On Shift</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">5 Bookings</div>
                <div className="text-xs text-gray-400">Next: 14:00</div>
              </div>
           </GlassCard>
        ))}
      </div>
    </div>
  );
};