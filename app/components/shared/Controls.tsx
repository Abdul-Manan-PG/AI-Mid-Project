'use client';

import { useState } from 'react';
import { useSlidingStore } from '@/app/store/slidingStore';
import { Play, Shuffle, Loader2 } from 'lucide-react';

export default function Controls() {
  const { scramble, solve, isSolving, board } = useSlidingStore();
  const [algorithm, setAlgorithm] = useState('A*');

  // Check if board is already solved to disable the solve button
  const isSolved = board.join(',') === '1,2,3,4,5,6,7,8,0' || board.join(',') === '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0';

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-[500px] mt-6">
      
      {/* Algorithm Selector */}
      <select 
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        disabled={isSolving}
        className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-500 transition-colors w-full sm:w-auto"
      >
        <option value="A*">A* (Optimal)</option>
        <option value="BFS">BFS (Optimal)</option>
        <option value="DFS">DFS (Fast, Not Optimal)</option>
        <option value="IDS">IDS (Optimal)</option>
      </select>

      {/* Scramble Button */}
      <button
        onClick={scramble}
        disabled={isSolving}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 w-full sm:w-auto"
      >
        <Shuffle size={18} /> Scramble
      </button>

      {/* Solve Button */}
      <button
        onClick={() => solve(algorithm)}
        disabled={isSolving || isSolved}
        className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:bg-slate-700 w-full sm:w-auto"
      >
        {isSolving ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} 
        {isSolving ? 'Solving...' : 'Auto Solve'}
      </button>
    </div>
  );
}