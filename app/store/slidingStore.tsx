import { create } from 'zustand';
import { solveSlidingPuzzle } from '../lib/api'

interface SlidingState {
  board: number[];
  size: number; // 3 or 4
  isSolving: boolean;
  solutionMoves: any[];
  stats: any;
  setBoard: (board: number[], size: number) => void;
  scramble: () => void;
  solve: (algorithm: string) => Promise<void>;
}

export const useSlidingStore = create<SlidingState>((set, get) => ({
  board: [1, 2, 3, 4, 5, 6, 7, 8, 0], // Default 3x3 goal state
  size: 3,
  isSolving: false,
  solutionMoves: [],
  stats: null,

  setBoard: (board, size) => set({ board, size }),

  scramble: () => {
    // Basic scramble logic (you can improve this to guarantee solvability)
    const currentBoard = [...get().board];
    for (let i = currentBoard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentBoard[i], currentBoard[j]] = [currentBoard[j], currentBoard[i]];
    }
    set({ board: currentBoard, solutionMoves: [], stats: null });
  },

  solve: async (algorithm: string) => {
    set({ isSolving: true });
    try {
      const data = await solveSlidingPuzzle(get().board, algorithm);
      set({ 
        solutionMoves: data.solution_path,
        stats: {
          nodes: data.nodes_explored,
          time: data.execution_time_s,
          depth: data.max_depth
        }
      });
      // Animation playback logic will go here
    } catch (error) {
      console.error("Failed to solve:", error);
    } finally {
      set({ isSolving: false });
    }
  }
}));