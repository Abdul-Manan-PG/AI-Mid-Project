'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid3X3, Box, ArrowRight, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-16 px-4 relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full flex flex-col items-center z-10"
      >
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <BrainCircuit className="text-cyan-400" size={32} />
          <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">AI Mid Project</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
          State-Space Search Visualizer
        </h1>

        {/* Introduction / About the Project */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl backdrop-blur-sm text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-100 mb-3">About This Project</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            This application demonstrates the power of Artificial Intelligence in solving complex state-space problems. 
            By leveraging classical search algorithms—including <strong className="text-slate-200">BFS, DFS, DLS, IDS, and A*</strong> with Manhattan Distance heuristics—the backend efficiently navigates millions of potential board configurations. 
            For the Rubik's Cube, the engine utilizes the highly optimized Kociemba algorithm to find solutions in milliseconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-800 pt-4 mt-2">
            <span className="text-sm text-slate-500">Built with Next.js, Framer Motion, Three.js & Flask</span>
            <span className="text-sm font-medium text-slate-300 mt-2 sm:mt-0">
              Developed by Abdul Manan & Usman Shahid
            </span>
          </div>
        </div>

        {/* Game Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* Sliding Puzzle Card */}
          <Link href="/sliding" className="group">
            <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Grid3X3 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Sliding Puzzle</h3>
              <p className="text-slate-400 flex-grow mb-8">
                Solve the classic 8-puzzle (3x3) and 15-puzzle (4x4). Watch the AI calculate the optimal path and animate the tiles into their goal state.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold mt-auto">
                Launch Environment <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Rubik's Cube Card */}
          <Link href="/cube" className="group">
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
              <div className="bg-emerald-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Box size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">3D Rubik's Cube</h3>
              <p className="text-slate-400 flex-grow mb-8">
                Interact with a fully 3D Rubik's cube. Scramble the faces and let the Kociemba backend calculate the exact sequence to restore it.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold mt-auto">
                Launch Environment <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </motion.div>
    </main>
  );
}