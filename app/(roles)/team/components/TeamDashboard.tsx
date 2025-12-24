"use client";
import WeeklyBrain from './WeeklyBrain';
import VibeManager from './VibeManager';
import VenueApprovals from './VenueApprovals';
import FlashAnalytics from './FlashAnalytics';

export default function TeamDashboard({ role }: { role: 'admin' | 'colaborador' }) {
  return (
    <div className="space-y-6 p-4">
      {role === 'admin' && <WeeklyBrain />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VibeManager />
        <VenueApprovals />
      </div>
      <FlashAnalytics />
    </div>
  );
}
