'use client';

import { useState } from 'react';
import { usePuzzle } from '@/lib/usePuzzle';

export default function SlidingPuzzle() {
  const [dimensions, setDimensions] = useState({ rows: 3, cols: 3 });
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1579546929518-9e396f3cc809');
  
  // API and Stats state
  const [algorithm, setAlgorithm] = useState('A_STAR');
  const [isSolving, setIsSolving] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const { 
    board, 
    move, 
    shuffle, 
    isSolved, 
    emptyIndex, 
    goalState,
    solutionStates,
    setSolutionStates,
    sliderIndex,
    setSliderIndex
  } = usePuzzle(dimensions.rows, dimensions.cols);

  // The active board to display (either standard board or a frame from the AI solution)
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
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  const handleSolve = async () => {
    setIsSolving(true);
    setStats(null);
    try {
      const response = await fetch('http://localhost:8000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initial_state: board,
          goal_state: goalState,
          dimensions: dimensions,
          algorithm: algorithm
        })
      });

      if (!response.ok) throw new Error('Failed to solve');
      
      const data = await response.json();
      if (data.solvable) {
        setSolutionStates(data.states);
        setStats(data.statistics);
        setSliderIndex(0); // Reset slider to start of solution
      } else {
        alert("Puzzle is unsolvable!");
      }
    } catch (error) {
      console.error(error);
      alert("Error solving puzzle. Is the Python backend running?");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        AI Sliding Puzzle
      </h1>
      <div className="flex flex-col items-center gap-4 mb-6">
  <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition">
    📁 Upload Gallery Image
    <input 
      type="file" 
      accept="image/*" 
      className="hidden" 
      onChange={handleImageUpload} 
    />
  </label>
  <p className="text-xs text-gray-500">Supported: JPG, PNG, WEBP</p>
</div>
      {/* Control Panel */}
      <div className="flex flex-wrap gap-4 mb-8 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <select 
          className="bg-gray-900 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          onChange={(e) => {
            const [r, c] = e.target.value.split('x').map(Number);
            setDimensions({ rows: r, cols: c });
            setSolutionStates([]); // Clear solution on resize
          }}
          defaultValue="3x3"
        >
          <option value="3x3">3x3</option>
          <option value="4x3">4x3</option>
          <option value="4x4">4x4</option>
          <option value="5x5">5x5</option>
        </select>

        <select 
          className="bg-gray-900 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="A_STAR">A* Search</option>
          <option value="BFS" disabled>BFS (Pending)</option>
          <option value="DFS" disabled>DFS (Pending)</option>
        </select>
        
        <button 
          onClick={shuffle}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold transition"
        >
          Shuffle
        </button>

        <button 
          onClick={handleSolve}
          disabled={isSolving || isSolved}
          className={`px-6 py-2 rounded font-bold transition flex items-center gap-2
            ${isSolving || isSolved ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {isSolving ? 'Thinking...' : 'Solve with AI'}
        </button>
      </div>

      {/* The Game Board */}
      <div 
        className="relative bg-gray-800 p-2 rounded-xl shadow-2xl mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${dimensions.rows}, minmax(0, 1fr))`,
          gap: '4px',
          width: 'min(90vw, 450px)',
          aspectRatio: `${dimensions.cols} / ${dimensions.rows}`
        }}
      >
        {displayBoard.map((value, index) => {
          const isEmpty = value === emptyIndex;
          return (
            <div
              key={value}
              onClick={() => move(index)}
              className={`
                rounded-md shadow-inner cursor-pointer transition-all duration-300 ease-out
                ${isEmpty ? 'opacity-0 cursor-default' : 'hover:brightness-110'}
              `}
              style={{
                backgroundImage: isEmpty ? 'none' : `url(${imageUrl})`,
                backgroundSize: `${dimensions.cols * 100}% ${dimensions.rows * 100}%`,
                backgroundPosition: getBackgroundPosition(value),
              }}
            />
          );
        })}
      </div>

      {/* Playback Slider (Only shows if AI solved it) */}
      {solutionStates.length > 0 && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
          <div className="flex justify-between text-sm mb-2 text-gray-300">
            <span>Start</span>
            <span>Step: {sliderIndex} / {solutionStates.length - 1}</span>
            <span>Solved</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={solutionStates.length - 1} 
            value={sliderIndex}
            onChange={(e) => setSliderIndex(Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}

      {/* AI Statistics Card */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 text-center w-full max-w-md">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 uppercase">Time</div>
            <div className="text-lg font-bold text-blue-400">{stats.time_taken_ms}ms</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 uppercase">Nodes</div>
            <div className="text-lg font-bold text-purple-400">{stats.nodes_expanded}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 uppercase">Depth</div>
            <div className="text-lg font-bold text-green-400">{stats.max_depth}</div>
          </div>
        </div>
      )}
    </div>
  );
}