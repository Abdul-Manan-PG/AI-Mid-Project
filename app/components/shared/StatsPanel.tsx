'use client';

import { useSlidingStore } from '@/app/store/slidingStore';

export default function StatsPanel() {
  const { stats } = useSlidingStore();

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-[500px] mt-6">
      <StatBox label="Moves" value={stats.moves} />
      <StatBox label="Nodes Explored" value={stats.nodes.toLocaleString()} />
      <StatBox label="Time (s)" value={stats.time.toFixed(4)} />
      <StatBox label="Max Depth" value={stats.depth} />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-center">
      <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1 text-center">{label}</span>
      <span className="text-lg font-bold text-cyan-400">{value}</span>
    </div>
  );
}