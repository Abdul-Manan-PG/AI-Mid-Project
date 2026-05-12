'use client';

import { useCubeStore } from '@/app/store/cubeStore';
import { Shuffle, Loader2, Play, SkipBack, SkipForward } from 'lucide-react';

export default function CubeControls() {
  const { 
    isSolving, 
    activeMove, 
    solutionPath, 
    currentStepIndex, 
    scramble, 
    solveFromBackend, 
    stepNext, 
    stepPrev,
    manualMove 
  } = useCubeStore();

  const isAnimating = activeMove !== null;
  const hasSolution = solutionPath.length > 0;
  const isSolved = hasSolution && currentStepIndex === solutionPath.length;

  const standardMoves = ['U', 'D', 'R', 'L', 'F', 'B'];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[600px] mt-6">
      
      {/* Primary Actions */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <button
          onClick={scramble}
          disabled={isSolving || isAnimating}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Shuffle size={18} /> Scramble
        </button>

        <button
          onClick={solveFromBackend}
          disabled={isSolving || isAnimating || hasSolution}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:bg-slate-700"
        >
          {isSolving ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} 
          {isSolving ? 'Calculating...' : 'Auto Solve'}
        </button>
      </div>

      {/* Playback Controls (Only visible when a solution exists) */}
      {hasSolution && (
        <div className="flex flex-col items-center bg-slate-800/50 border border-slate-700 rounded-xl p-4 w-full">
          <div className="text-sm font-semibold text-emerald-400 mb-4 tracking-wider uppercase">
            Solution Playback : Step {currentStepIndex} of {solutionPath.length}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={stepPrev}
              disabled={isAnimating || currentStepIndex === 0}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white disabled:opacity-30 transition-colors"
              title="Previous Move"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={stepNext}
              disabled={isAnimating || isSolved}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white disabled:opacity-30 transition-colors"
              title="Next Move"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Virtual Control Pad for Manual Play */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full">
        <div className="text-xs text-slate-500 font-semibold mb-3 text-center uppercase tracking-widest">
          Manual Controls (Virtual Pad)
        </div>
        <div className="grid grid-cols-6 gap-2">
          {standardMoves.map((m) => (
            <div key={m} className="flex flex-col gap-2">
              <button
                onClick={() => manualMove(m)}
                disabled={isAnimating || isSolving}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded font-mono text-sm disabled:opacity-50"
              >
                {m}
              </button>
              <button
                onClick={() => manualMove(m + "'")}
                disabled={isAnimating || isSolving}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded font-mono text-sm disabled:opacity-50"
              >
                {m}'
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}