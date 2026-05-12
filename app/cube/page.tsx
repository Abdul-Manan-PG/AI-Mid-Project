'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Scene from '@/app/components/cube/Scene';
import CubeControls from '@/app/components/cube/CubeControls';
import { useCubeStore } from '@/app/store/cubeStore';

export default function CubePage() {
  const { stats } = useCubeStore();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-8 px-4 relative">
      
      {/* Back Navigation */}
      <div className="w-full max-w-4xl mb-6">
        <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </Link>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-slate-100">
            3D Rubik's Cube Engine
          </h1>
          <p className="text-slate-400">Powered by Kociemba's Two-Phase Algorithm & React Three Fiber</p>
        </div>

        {/* 3D Canvas Container */}
        <div className="w-full mb-6">
          <Scene />
        </div>

        {/* Analytics / Stats Panel */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[600px] mb-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Optimal Moves</span>
              <span className="text-2xl font-bold text-emerald-400">{stats.moves}</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Compute Time (s)</span>
              <span className="text-2xl font-bold text-emerald-400">{stats.time.toFixed(4)}</span>
            </div>
          </div>
        )}

        {/* Playback & Manual Controls */}
        <CubeControls />

      </div>
    </main>
  );
}