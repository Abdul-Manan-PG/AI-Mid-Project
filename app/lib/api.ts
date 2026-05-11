import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sliding Puzzle API Call
export const solveSlidingPuzzle = async (board: number[], algorithm: string) => {
  const response = await apiClient.post('/sliding/solve', { board, algorithm });
  return response.data;
};

// Rubik's Cube API Call
export const solveRubiksCube = async (state: string) => {
  const response = await apiClient.post('/cube/solve', { state });
  return response.data;
};