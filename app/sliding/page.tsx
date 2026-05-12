import Board from '@/app/components/sliding/Board';
import Controls from '@/app/components/shared/Controls';
import StatsPanel from '@/app/components/shared/StatsPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full flex flex-col items-center">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            AI Puzzle Solver
          </h1>
          <p className="text-slate-400">Powered by Next.js, Framer Motion, and Flask</p>
        </div>

        {/* The Game Board */}
        <Board />

        {/* Algorithm Selection & Buttons */}
        <Controls />

        {/* Performance Statistics */}
        <StatsPanel />

      </div>
    </main>
  );
}