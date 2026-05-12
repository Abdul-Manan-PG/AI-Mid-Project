'use client';

import { useState } from 'react';
import { usePuzzle } from '@/lib/usePuzzle';

const ALGORITHMS = [
  { id: 'A_STAR', name: 'A* Search', tag: 'HEURISTIC' },
  { id: 'BFS', name: 'Breadth-First', tag: 'BFS' },
  { id: 'DFS', name: 'Depth-First', tag: 'DFS' },
  { id: 'IDS', name: 'Iterative Deepening', tag: 'IDS' },
  { id: 'DLS', name: 'Depth-Limited', tag: 'DLS' }
];

const ALGO_COLORS: Record<string, string> = {
  A_STAR: '#00f5d4',
  BFS:    '#f72585',
  DFS:    '#ffd60a',
  IDS:    '#7b5ea7',
  DLS:    '#4cc9f0',
};

// Extracted static CSS to prevent hydration/re-render lag
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;900&display=swap');

  :root {
    --bg:        #050a0e;
    --surface:   #0b1318;
    --border:    #1a2e38;
    --border-hi: #1f4455;
    --cyan:      #00f5d4;
    --magenta:   #f72585;
    --yellow:    #ffd60a;
    --blue:      #4cc9f0;
    --muted:     #3a5a6a;
    --text:      #c8dde8;
    --text-dim:  #4a7a8a;
    --font-mono: 'Share Tech Mono', monospace;
    --font-ui:   'Rajdhani', sans-serif;
    --font-head: 'Orbitron', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .puzzle-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-ui);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.5rem 3rem;
    position: relative;
    overflow-x: hidden;
  }

  .puzzle-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,212,0.015) 2px, rgba(0,245,212,0.015) 4px);
    pointer-events: none;
    z-index: 0;
  }

  .puzzle-root > * { position: relative; z-index: 1; }

  .header { text-align: center; margin-bottom: 0.4rem; }
  .header-eyebrow { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.3em; color: var(--cyan); opacity: 0.7; margin-bottom: 0.4rem; }
  .header h1 { font-family: var(--font-head); font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 900; letter-spacing: 0.05em; color: #fff; line-height: 1; text-shadow: 0 0 40px rgba(0,245,212,0.4), 0 0 80px rgba(0,245,212,0.15); }
  .header h1 span { color: var(--cyan); }
  .header-sub { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-dim); margin-top: 0.5rem; }

  .divider { width: 100%; max-width: 900px; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); margin: 1.2rem 0; opacity: 0.3; }

  .action-bar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.8rem; }

  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; position: relative; }
  .panel::before { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; border-radius: 2px; background: linear-gradient(135deg, rgba(0,245,212,0.08), transparent 50%); pointer-events: none; }

  .bracket-panel { background: var(--surface); position: relative; padding: 1.25rem 1.4rem; }
  .bracket-panel::before, .bracket-panel::after { content: ''; position: absolute; width: 14px; height: 14px; border-color: var(--cyan); border-style: solid; opacity: 0.6; }
  .bracket-panel::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
  .bracket-panel::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  .btn-upload { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.12em; background: transparent; border: 1px solid var(--border-hi); color: var(--text-dim); padding: 0.55rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; text-transform: uppercase; }
  .btn-upload:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,212,0.15); }

  .mode-toggle { background: var(--surface); border: 1px solid var(--border-hi); padding: 3px; display: flex; gap: 2px; }
  .mode-btn { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.45rem 0.9rem; background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: all 0.2s; }
  .mode-btn.active-solve { background: rgba(0,245,212,0.1); color: var(--cyan); box-shadow: inset 0 0 12px rgba(0,245,212,0.05); }
  .mode-btn.active-compare { background: rgba(247,37,133,0.12); color: var(--magenta); box-shadow: inset 0 0 12px rgba(247,37,133,0.06); }

  .main-layout { display: flex; flex-direction: row; gap: 2rem; width: 100%; max-width: 1000px; justify-content: center; align-items: flex-start; }
  @media (max-width: 900px) { .main-layout { flex-direction: column; align-items: center; } }

  .left-col { display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 100%; max-width: 430px; }
  .right-col { flex: 1; width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 1rem; }

  .controls-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; width: 100%; margin-bottom: 1rem; padding: 0.75rem; }

  .select-styled { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.06em; background: #060c10; border: 1px solid var(--border-hi); color: var(--text); padding: 0.5rem 0.7rem; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234a7a8a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.6rem center; padding-right: 1.8rem; transition: border-color 0.2s; }
  .select-styled:focus { border-color: var(--cyan); }

  .btn-base { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.5rem 1rem; border: 1px solid; cursor: pointer; transition: all 0.2s; background: transparent; }
  .btn-shuffle { border-color: var(--border-hi); color: var(--text-dim); }
  .btn-shuffle:hover { border-color: var(--yellow); color: var(--yellow); box-shadow: 0 0 10px rgba(255,214,10,0.15); }
  .btn-reset { border-color: rgba(247,37,133,0.3); color: rgba(247,37,133,0.6); }
  .btn-reset:hover { border-color: var(--magenta); color: var(--magenta); box-shadow: 0 0 10px rgba(247,37,133,0.2); }
  
  .btn-solve { border-color: rgba(0,245,212,0.4); color: var(--cyan); background: rgba(0,245,212,0.05); font-weight: bold; padding: 0.5rem 1.4rem; }
  .btn-solve:hover:not(:disabled) { background: rgba(0,245,212,0.12); box-shadow: 0 0 20px rgba(0,245,212,0.2); }
  .btn-solve:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-solve.solving { animation: pulse-solve 1.2s infinite; }
  @keyframes pulse-solve { 0%, 100% { box-shadow: 0 0 6px rgba(0,245,212,0.2); } 50% { box-shadow: 0 0 22px rgba(0,245,212,0.5); } }

  .board-wrapper { position: relative; width: 100%; margin-bottom: 1rem; }
  .board-corner { position: absolute; width: 20px; height: 20px; border-color: var(--cyan); border-style: solid; opacity: 0.4; z-index: 2; pointer-events: none; transition: opacity 0.3s; }
  .board-wrapper:hover .board-corner { opacity: 0.8; }
  .bc-tl { top: -2px; left: -2px; border-width: 2px 0 0 2px; }
  .bc-tr { top: -2px; right: -2px; border-width: 2px 2px 0 0; }
  .bc-bl { bottom: -2px; left: -2px; border-width: 0 0 2px 2px; }
  .bc-br { bottom: -2px; right: -2px; border-width: 0 2px 2px 0; }

  .board-grid { position: relative; background: #030709; padding: 3px; display: grid; width: 100%; transition: box-shadow 0.6s; }
  .board-grid.solved { box-shadow: 0 0 0 1px var(--cyan), 0 0 40px rgba(0,245,212,0.25), 0 0 80px rgba(0,245,212,0.1); }

  .tile { position: relative; overflow: hidden; cursor: pointer; transition: filter 0.2s, transform 0.15s; }
  .tile:hover:not(.tile-empty) { filter: brightness(1.18); transform: scale(0.97); }
  .tile-empty { opacity: 0; cursor: default; pointer-events: none; }
  .tile-inner { position: absolute; inset: 0; background-size: var(--bg-size); background-position: var(--bg-pos); }
  .tile::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%); pointer-events: none; }

  .slider-panel { width: 100%; padding: 1rem 1.2rem; margin-bottom: 0.5rem; }
  .slider-labels { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); margin-bottom: 0.6rem; letter-spacing: 0.08em; }
  .slider-labels span.step-label { color: var(--cyan); font-weight: bold; }
  
  input[type=range].styled-range { width: 100%; height: 3px; background: var(--border-hi); border-radius: 0; outline: none; -webkit-appearance: none; appearance: none; cursor: pointer; }
  input[type=range].styled-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--cyan); border-radius: 0; box-shadow: 0 0 8px rgba(0,245,212,0.6); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }

  .panel-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border); }
  .panel-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .panel-title { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-dim); }
  .panel-badge { margin-left: auto; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.12em; padding: 0.2rem 0.5rem; border: 1px solid; text-transform: uppercase; }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.6rem; }
  .stat-card { background: #060d11; border: 1px solid var(--border); padding: 0.9rem 1rem; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent-color, var(--cyan)); opacity: 0.5; }
  .stat-label { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.18em; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.4rem; }
  .stat-value { font-family: var(--font-head); font-size: 1.6rem; font-weight: 900; line-height: 1; color: var(--accent-color, var(--cyan)); text-shadow: 0 0 20px var(--accent-color, var(--cyan)); }
  .stat-value .stat-unit { font-size: 0.75rem; opacity: 0.5; margin-left: 2px; }
  .stat-full { grid-column: 1 / -1; }

  .compare-panel { padding: 1.25rem 1.4rem; }
  .algo-grid { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem; }
  .algo-chip { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; padding: 0.35rem 0.75rem; border: 1px solid var(--border-hi); color: var(--text-dim); background: transparent; cursor: pointer; transition: all 0.2s; text-transform: uppercase; user-select: none; }
  .algo-chip.selected { border-color: var(--chip-color); color: var(--chip-color); background: rgba(0,0,0,0.4); box-shadow: 0 0 10px rgba(0,0,0,0.3), inset 0 0 8px rgba(0,0,0,0.2); text-shadow: 0 0 8px var(--chip-color); }

  .btn-run { width: 100%; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; background: transparent; border: 1px solid var(--magenta); color: var(--magenta); cursor: pointer; transition: all 0.25s; margin-bottom: 1.5rem; position: relative; overflow: hidden; }
  .btn-run::before { content: ''; position: absolute; inset: 0; background: var(--magenta); opacity: 0; transition: opacity 0.25s; }
  .btn-run:hover:not(:disabled)::before { opacity: 0.08; }
  .btn-run:hover:not(:disabled) { box-shadow: 0 0 25px rgba(247,37,133,0.3); }
  .btn-run:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-run.running { animation: pulse-magenta 1s infinite; }
  @keyframes pulse-magenta { 0%, 100% { box-shadow: 0 0 8px rgba(247,37,133,0.2); } 50% { box-shadow: 0 0 28px rgba(247,37,133,0.5); } }

  .chart-section { margin-bottom: 1.2rem; }
  .chart-label { font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.2em; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.8rem; }
  .bar-row { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.7rem; }
  .bar-name { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); width: 2.8rem; flex-shrink: 0; text-align: right; }
  .bar-track { flex: 1; height: 4px; background: rgba(255,255,255,0.04); position: relative; }
  .bar-fill { position: absolute; left: 0; top: 0; bottom: 0; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
  .bar-val { font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-dim); width: 5rem; flex-shrink: 0; text-align: right; }

  .solved-banner { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.25em; color: var(--cyan); text-align: center; margin-top: 0.5rem; animation: blink 1.5s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease-out forwards; }
`;

export default function SlidingPuzzle() {
  const [dimensions, setDimensions] = useState({ rows: 3, cols: 3 });
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1579546929518-9e396f3cc809');

  const [isCompareMode, setIsCompareMode] = useState(false);

  const [algorithm, setAlgorithm] = useState('A_STAR');
  const [isSolving, setIsSolving] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const [selectedAlgos, setSelectedAlgos] = useState<string[]>(['A_STAR', 'BFS', 'IDS']);
  const [compareResults, setCompareResults] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [runningAlgo, setRunningAlgo] = useState<string | null>(null);

  const {
    board, setBoard, move, shuffle, isSolved, emptyIndex, goalState,
    solutionStates, setSolutionStates, sliderIndex, setSliderIndex
  } = usePuzzle(dimensions.rows, dimensions.cols);

  const displayBoard = solutionStates.length > 0 ? solutionStates[sliderIndex] : board;

  const getBackgroundPosition = (value: number) => {
    const targetCol = value % dimensions.cols;
    const targetRow = Math.floor(value / dimensions.cols);
    const x = (targetCol / (dimensions.cols - 1)) * 100;
    const y = (targetRow / (dimensions.rows - 1)) * 100;
    return `${x}% ${y}%`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Memory Optimization: Object URLs are significantly faster and lighter than Base64 FileReader
      const url = URL.createObjectURL(file);
      setImageUrl((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev); // Cleanup old URL to prevent memory leaks
        return url;
      });
    }
  };

  const handleReset = () => {
    setBoard(goalState);
    setSolutionStates([]);
    setSliderIndex(0);
    setStats(null);
    setCompareResults([]);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setStats(null);
    try {
      const response = await fetch('http://localhost:8000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_state: board, goal_state: goalState, dimensions, algorithm })
      });
      
      // FIX: Explicitly catch Bad Requests (Unsolvable / Depth Limits)
      if (response.status === 400) {
        alert("Puzzle is unsolvable at this depth!");
        return;
      }
      if (!response.ok) throw new Error('Failed to solve');
      
      const data = await response.json();
      if (data.solvable) {
        setSolutionStates(data.states);
        setStats(data.statistics);
        setSliderIndex(0);
      }
    } catch (error) {
      console.error(error);
      alert("Error solving puzzle. Check if backend is running.");
    } finally {
      setIsSolving(false);
    }
  };

  const toggleCompareAlgo = (algoId: string) => {
    setSelectedAlgos(prev =>
      prev.includes(algoId) ? prev.filter(id => id !== algoId) : [...prev, algoId]
    );
  };

  const handleRunComparison = async () => {
    if (selectedAlgos.length === 0) return alert("Select at least one algorithm!");
    setIsComparing(true);
    setCompareResults([]);
    
    const results = [];
    for (const algo of selectedAlgos) {
      setRunningAlgo(algo); // UX Improvement: Tell the user which algo is currently being tested
      try {
        const response = await fetch('http://localhost:8000/api/solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initial_state: board, goal_state: goalState, dimensions, algorithm: algo })
        });
        
        if (response.status === 400) {
           results.push({ algorithm: algo, success: false, stats: null });
        } else if (response.ok) {
          const data = await response.json();
          results.push({ algorithm: algo, success: data.solvable, stats: data.statistics });
        } else {
          results.push({ algorithm: algo, success: false, stats: null });
        }
      } catch (e) {
        results.push({ algorithm: algo, success: false, stats: null });
      }
    }
    
    setCompareResults(results);
    setRunningAlgo(null);
    setIsComparing(false);
  };

  // Safe checks for empty arrays
  const maxTime  = Math.max(...compareResults.map(r => r.stats?.time_taken_ms  || 0), 1);
  const maxNodes = Math.max(...compareResults.map(r => r.stats?.nodes_expanded || 0), 1);

  const algoObj = ALGORITHMS.find(a => a.id === algorithm)!;

  return (
    <>
      {/* Dangerously Set CSS ensures the block is evaluated correctly without React hydration mismatch warnings */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="puzzle-root">
        {/* Header */}
        <div className="header">
          <div className="header-eyebrow">AUTONOMOUS PATHFINDING ENGINE v2.4</div>
          <h1>AI SLIDING <span>PUZZLE</span></h1>
          <div className="header-sub">SEARCH ALGORITHM VISUALIZER // HEURISTIC BENCHMARKING SUITE</div>
        </div>

        <div className="divider" />

        {/* Action Bar */}
        <div className="action-bar">
          <label className="btn-base btn-upload" style={{ borderWidth: '1px', borderStyle: 'solid' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            LOAD IMAGE
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>

          <div className="mode-toggle">
            <button
              className={`mode-btn ${!isCompareMode ? 'active-solve' : ''}`}
              onClick={() => setIsCompareMode(false)}
            >
              SOLVE
            </button>
            <button
              className={`mode-btn ${isCompareMode ? 'active-compare' : ''}`}
              onClick={() => setIsCompareMode(true)}
            >
              BENCHMARK
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="main-layout">

          {/* LEFT: Controls + Board */}
          <div className="left-col">
            <div className="panel bracket-panel controls-row" style={{ width: '100%', marginBottom: '1rem' }}>
              <select
                className="select-styled"
                onChange={(e) => {
                  const [r, c] = e.target.value.split('x').map(Number);
                  setDimensions({ rows: r, cols: c });
                  handleReset();
                }}
                defaultValue="3x3"
              >
                {['3x3','4x4','5x5','6x6','7x7'].map(s => <option key={s} value={s}>{s} GRID</option>)}
              </select>

              <button className="btn-base btn-shuffle" onClick={shuffle}>SHUFFLE</button>
              <button className="btn-base btn-reset"   onClick={handleReset}>RESET</button>

              {!isCompareMode && (
                <>
                  <select
                    className="select-styled"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  >
                    {ALGORITHMS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <button
                    className={`btn-base btn-solve ${isSolving ? 'solving' : ''}`}
                    onClick={handleSolve}
                    disabled={isSolving || isSolved}
                  >
                    {isSolving ? '// SOLVING...' : '▶ SOLVE'}
                  </button>
                </>
              )}
            </div>

            {/* Board */}
            <div className="board-wrapper">
              <div className="board-corner bc-tl" />
              <div className="board-corner bc-tr" />
              <div className="board-corner bc-bl" />
              <div className="board-corner bc-br" />
              <div
                key={`${dimensions.rows}-${dimensions.cols}`}
                className={`board-grid ${isSolved && !isCompareMode ? 'solved' : ''}`}
                style={{
                  gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
                  gridTemplateRows:    `repeat(${dimensions.rows}, minmax(0, 1fr))`,
                  gap: isSolved && !isCompareMode ? '0px' : '3px',
                  aspectRatio: `${dimensions.cols} / ${dimensions.rows}`,
                }}
              >
                {displayBoard.map((value, index) => {
                  const isEmpty = value === emptyIndex;
                  const isMissing = isEmpty && (!isSolved || isCompareMode);
                  return (
                    <div
                      key={value}
                      className={`tile ${isMissing ? 'tile-empty' : ''}`}
                      onClick={() => { if (!isSolved) move(index); }}
                      style={{ borderRadius: isSolved && !isCompareMode ? '0' : '1px' }}
                    >
                      {!isMissing && (
                        <div
                          className="tile-inner"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: `${dimensions.cols * 100}% ${dimensions.rows * 100}%`,
                            backgroundPosition: getBackgroundPosition(value),
                          } as React.CSSProperties}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isSolved && !isCompareMode && (
              <div className="solved-banner">// PUZZLE SOLVED — GOAL STATE REACHED</div>
            )}

            {/* Slider */}
            {!isCompareMode && solutionStates.length > 0 && (
              <div className="panel bracket-panel slider-panel fade-up" style={{ width: '100%' }}>
                <div className="slider-labels">
                  <span>STATE_0</span>
                  <span className="step-label">STEP {sliderIndex} / {solutionStates.length - 1}</span>
                  <span>GOAL</span>
                </div>
                <input
                  type="range"
                  className="styled-range"
                  min="0"
                  max={solutionStates.length - 1}
                  value={sliderIndex}
                  onChange={(e) => setSliderIndex(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* RIGHT: Stats / Compare */}
          <div className="right-col">

            {isCompareMode ? (
              <div className="panel bracket-panel compare-panel fade-up">
                <div className="panel-header">
                  <div className="panel-dot" style={{ background: 'var(--magenta)', boxShadow: '0 0 6px var(--magenta)' }} />
                  <span className="panel-title">Benchmark Engine</span>
                  <span className="panel-badge" style={{ borderColor: 'var(--magenta)', color: 'var(--magenta)' }}>
                    {selectedAlgos.length} SELECTED
                  </span>
                </div>

                <div className="algo-grid">
                  {ALGORITHMS.map(algo => (
                    <label
                      key={algo.id}
                      className={`algo-chip ${selectedAlgos.includes(algo.id) ? 'selected' : ''}`}
                      style={{ '--chip-color': ALGO_COLORS[algo.id] } as React.CSSProperties}
                    >
                      <input
                        type="checkbox"
                        style={{ display: 'none' }}
                        checked={selectedAlgos.includes(algo.id)}
                        onChange={() => toggleCompareAlgo(algo.id)}
                      />
                      {algo.tag}
                    </label>
                  ))}
                </div>

                <button
                  className={`btn-run ${isComparing ? 'running' : ''}`}
                  onClick={handleRunComparison}
                  disabled={isComparing || selectedAlgos.length === 0}
                >
                  {isComparing ? `// RUNNING: ${runningAlgo?.replace('_', '*')}...` : '▶ RUN BENCHMARKS'}
                </button>

                {compareResults.length > 0 && (
                  <div className="fade-up">
                    {/* Nodes chart */}
                    <div className="chart-section">
                      <div className="chart-label">NODES EXPANDED — MEMORY COST</div>
                      {compareResults.map((res, i) => (
                        <div key={i} className="bar-row">
                          <div className="bar-name">{res.algorithm.replace('_', '*')}</div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{
                                width: res.success ? `${(res.stats.nodes_expanded / maxNodes) * 100}%` : '0%',
                                background: ALGO_COLORS[res.algorithm],
                                boxShadow: `0 0 6px ${ALGO_COLORS[res.algorithm]}88`
                              }}
                            />
                          </div>
                          <div className="bar-val" style={{ color: ALGO_COLORS[res.algorithm] }}>
                            {res.success ? res.stats.nodes_expanded.toLocaleString() : 'LIMIT'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time chart */}
                    <div className="chart-section">
                      <div className="chart-label">EXECUTION TIME — SPEED</div>
                      {compareResults.map((res, i) => (
                        <div key={i} className="bar-row">
                          <div className="bar-name">{res.algorithm.replace('_', '*')}</div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{
                                width: res.success ? `${(res.stats.time_taken_ms / maxTime) * 100}%` : '0%',
                                background: ALGO_COLORS[res.algorithm],
                                boxShadow: `0 0 6px ${ALGO_COLORS[res.algorithm]}88`
                              }}
                            />
                          </div>
                          <div className="bar-val" style={{ color: ALGO_COLORS[res.algorithm] }}>
                            {res.success ? `${res.stats.time_taken_ms}ms` : 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            ) : stats && (
              <div className="panel bracket-panel fade-up" style={{ padding: '1.25rem 1.4rem' }}>
                <div className="panel-header">
                  <div className="panel-dot" style={{ background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }} />
                  <span className="panel-title">Solve Statistics</span>
                  <span className="panel-badge" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                    {algoObj?.tag}
                  </span>
                </div>

                <div className="stat-grid">
                  <div className="stat-card" style={{ '--accent-color': 'var(--blue)' } as React.CSSProperties}>
                    <div className="stat-label">Compute Time</div>
                    <div className="stat-value" style={{ color: 'var(--blue)', textShadow: '0 0 20px var(--blue)' }}>
                      {stats.time_taken_ms}
                      <span className="stat-unit">ms</span>
                    </div>
                  </div>

                  <div className="stat-card" style={{ '--accent-color': 'var(--magenta)' } as React.CSSProperties}>
                    <div className="stat-label">Nodes Explored</div>
                    <div className="stat-value" style={{ color: 'var(--magenta)', textShadow: '0 0 20px var(--magenta)', fontSize: '1.3rem' }}>
                      {stats.nodes_expanded.toLocaleString()}
                    </div>
                  </div>

                  <div className="stat-card stat-full" style={{ '--accent-color': 'var(--cyan)' } as React.CSSProperties}>
                    <div className="stat-label">Solution Depth</div>
                    <div className="stat-value">
                      {stats.max_depth}
                      <span className="stat-unit">moves</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}