import { create } from 'zustand';
import { solveRubiksCube } from '@/app/lib/api';
import { SOLVED_STATE, applyMoveToString, getInverseMove } from '@/app/lib/cubeLogic';

interface CubeState {
  currentStateString: string;
  isSolving: boolean;
  isPlaying: boolean;
  
  // Animation queue state
  activeMove: string | null; 
  
  // Playback Track
  solutionPath: string[];
  currentStepIndex: number;
  stats: { moves: number; time: number } | null;

  // Actions
  manualMove: (move: string) => void;
  scramble: () => void;
  solveFromBackend: () => Promise<void>;
  
  // Playback Controls
  stepNext: () => void;
  stepPrev: () => void;
  togglePlay: () => void;
  clearActiveMove: () => void;
}

export const useCubeStore = create<CubeState>((set, get) => ({
  currentStateString: SOLVED_STATE,
  isSolving: false,
  isPlaying: false,
  activeMove: null,
  solutionPath: [],
  currentStepIndex: 0,
  stats: null,

  manualMove: (move: string) => {
    // Prevent manual moves if an animation is currently playing
    if (get().activeMove) return;
    
    // Update the mathematical string representation
    const nextState = applyMoveToString(get().currentStateString, move);
    
    set({ 
      activeMove: move,             // Trigger the 3D animation
      currentStateString: nextState, // Sync the state string
      solutionPath: [],             // User intervened, so clear any existing solution path
      stats: null
    });
  },

  scramble: () => {
    if (get().activeMove || get().isSolving) return;
    
    const MOVES = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"];
    let scrambleString = get().currentStateString;
    
    // Apply 20 random moves to mathematically scramble the string
    for(let i = 0; i < 20; i++) {
      const randomMove = MOVES[Math.floor(Math.random() * MOVES.length)];
      scrambleString = applyMoveToString(scrambleString, randomMove);
    }
    
    // For this implementation, we instantly map the 3D cube to the scrambled string.
    // Setting activeMove to null ensures the 3D engine snaps to the new state.
    set({ 
      currentStateString: scrambleString,
      solutionPath: [],
      currentStepIndex: 0,
      stats: null,
      activeMove: null 
    });
  },

  solveFromBackend: async () => {
    set({ isSolving: true, solutionPath: [], currentStepIndex: 0 });
    
    try {
      // Send the current 54-char string to Flask port 5000
      const data = await solveRubiksCube(get().currentStateString);
      
      set({ 
        solutionPath: data.solution_path,
        stats: { moves: data.moves_count, time: data.execution_time_s }
      });
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Failed to solve. Ensure your Flask server is running and the state is valid.");
    } finally {
      set({ isSolving: false });
    }
  },

  stepNext: () => {
    const { solutionPath, currentStepIndex, activeMove } = get();
    
    // Don't step forward if currently animating or if we reached the end
    if (activeMove || currentStepIndex >= solutionPath.length) return;

    const nextMove = solutionPath[currentStepIndex];
    const nextState = applyMoveToString(get().currentStateString, nextMove);

    set({ 
      activeMove: nextMove, 
      currentStateString: nextState,
      currentStepIndex: currentStepIndex + 1 
    });
  },

  stepPrev: () => {
    const { solutionPath, currentStepIndex, activeMove } = get();
    
    // Don't step backward if currently animating or if we are at the beginning
    if (activeMove || currentStepIndex <= 0) return;

    const previousMove = solutionPath[currentStepIndex - 1];
    const inverseMove = getInverseMove(previousMove); // e.g., "R" becomes "R'"
    const prevState = applyMoveToString(get().currentStateString, inverseMove);

    set({ 
      activeMove: inverseMove, 
      currentStateString: prevState,
      currentStepIndex: currentStepIndex - 1 
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // The 3D component calls this exactly when its rotation animation finishes
  clearActiveMove: () => set({ activeMove: null }),
}));