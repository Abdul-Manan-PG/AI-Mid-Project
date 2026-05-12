// A solved cube string: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
export const SOLVED_STATE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

// Helper to swap characters in a string
const swap = (s: string, indices: number[]) => {
  const arr = s.split('');
  const temp = arr[indices[0]];
  for (let i = 0; i < indices.length - 1; i++) {
    arr[indices[i]] = arr[indices[i + 1]];
  }
  arr[indices[indices.length - 1]] = temp;
  return arr.join('');
};

// Applies a single standard move to the 54-char string
export const applyMoveToString = (state: string, move: string): string => {
  const face = move[0];
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  let nextState = state;
  const turns = isDouble ? 2 : isPrime ? 3 : 1; // Prime is just 3 clockwise turns

  for (let t = 0; t < turns; t++) {
    // These mappings represent how indices shift for a 90-degree clockwise turn
    if (face === 'U') {
      nextState = swap(nextState, [0, 6, 8, 2]); nextState = swap(nextState, [1, 3, 7, 5]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [36+i, 45+i, 9+i, 18+i]);
    } else if (face === 'R') {
      nextState = swap(nextState, [9, 15, 17, 11]); nextState = swap(nextState, [10, 12, 16, 14]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [2+i*3, 18+i*3, 35-i*3, 51-i*3]);
    } else if (face === 'F') {
      nextState = swap(nextState, [18, 24, 26, 20]); nextState = swap(nextState, [19, 21, 25, 23]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [6+i, 9+i*3, 29-i, 44-i*3]);
    } else if (face === 'D') {
      nextState = swap(nextState, [27, 33, 35, 29]); nextState = swap(nextState, [28, 30, 34, 32]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [24+i, 15+i, 51+i, 42+i]);
    } else if (face === 'L') {
      nextState = swap(nextState, [36, 42, 44, 38]); nextState = swap(nextState, [37, 39, 43, 41]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [0+i*3, 53-i*3, 27+i*3, 18+i*3]);
    } else if (face === 'B') {
      nextState = swap(nextState, [45, 51, 53, 47]); nextState = swap(nextState, [46, 48, 52, 50]);
      for (let i=0; i<3; i++) nextState = swap(nextState, [2-i, 36+i*3, 33+i, 17-i*3]);
    }
  }
  return nextState;
};

// Generates an inverse move (e.g., "R" -> "R'", "U'" -> "U", "F2" -> "F2")
export const getInverseMove = (move: string) => {
  if (move.includes("2")) return move;
  if (move.includes("'")) return move[0];
  return move + "'";
};