'use client';

import Tile from './Tile';
import { useSlidingStore } from '@/app/store/slidingStore';

export default function Board() {
  const { board, size, setBoard, isSolving } = useSlidingStore();

  // Handle manual clicks
  const handleTileClick = (index: number) => {
    if (isSolving) return;

    const emptyIndex = board.indexOf(0);
    
    // Calculate row and column for the clicked tile and the empty tile
    const row0 = Math.floor(emptyIndex / size);
    const col0 = emptyIndex % size;
    const row1 = Math.floor(index / size);
    const col1 = index % size;

    // Check if they are adjacent (Manhattan distance == 1)
    if (Math.abs(row0 - row1) + Math.abs(col0 - col1) === 1) {
      const newBoard = [...board];
      // Swap the clicked tile with the empty space
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      setBoard(newBoard, size);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className="grid gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900 rounded-2xl shadow-2xl w-full max-w-[400px] sm:max-w-[500px]"
        style={{ 
          // Dynamically set columns based on size (3 for 8-puzzle, 4 for 15-puzzle)
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` 
        }}
      >
        {board.map((value, index) => (
          <Tile
            // KEY IS CRITICAL: It must be the value so Framer Motion tracks the tile moving
            key={value}
            value={value}
            onClick={() => handleTileClick(index)}
            disabled={isSolving}
          />
        ))}
      </div>
    </div>
  );
}