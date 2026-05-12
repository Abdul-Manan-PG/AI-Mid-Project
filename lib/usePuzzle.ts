import { useState, useCallback, useEffect } from 'react';

export const usePuzzle = (rows: number, cols: number) => {
  const size = rows * cols;
  const goalState = Array.from(Array(size).keys());
  
  const [board, setBoard] = useState<number[]>(goalState);
  const [isSolved, setIsSolved] = useState(false);
  
  // AI Solution States
  const [solutionStates, setSolutionStates] = useState<number[][]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Check if current board matches the goal state
  useEffect(() => {
    const currentView = solutionStates.length > 0 ? solutionStates[sliderIndex] : board;
    const solved = currentView.every((val, index) => val === index);
    setIsSolved(solved);
  }, [board, solutionStates, sliderIndex]);

  const move = useCallback((index: number) => {
    // If a user clicks manually during a playback, invalidate the AI solution
    if (solutionStates.length > 0) {
      setBoard(solutionStates[sliderIndex]); // Snap board to current slider frame
      setSolutionStates([]); // Clear timeline
      setSliderIndex(0);
    }

    const currentBoard = solutionStates.length > 0 ? solutionStates[sliderIndex] : board;
    const emptyIndex = currentBoard.indexOf(size - 1);
    
    const row = Math.floor(index / cols);
    const col = index % cols;
    const emptyRow = Math.floor(emptyIndex / cols);
    const emptyCol = emptyIndex % cols;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newBoard = [...currentBoard];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
    }
  }, [board, cols, size, solutionStates, sliderIndex]);

  const shuffle = () => {
    setSolutionStates([]); // Clear any existing solution
    setSliderIndex(0);
    
    let currentBoard = [...goalState];
    let emptyIdx = size - 1;
    const shuffleMoves = 50; 

    for (let i = 0; i < shuffleMoves; i++) {
      const row = Math.floor(emptyIdx / cols);
      const col = emptyIdx % cols;
      const neighbors = [];

      if (row > 0) neighbors.push(emptyIdx - cols);
      if (row < rows - 1) neighbors.push(emptyIdx + cols);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < cols - 1) neighbors.push(emptyIdx + 1);

      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      [currentBoard[randomNeighbor], currentBoard[emptyIdx]] = [currentBoard[emptyIdx], currentBoard[randomNeighbor]];
      emptyIdx = randomNeighbor;
    }
    setBoard(currentBoard);
  };

  return { 
    board, 
    setBoard, 
    move, 
    shuffle, 
    isSolved, 
    emptyIndex: size - 1,
    goalState,
    solutionStates,
    setSolutionStates,
    sliderIndex,
    setSliderIndex
  };
};