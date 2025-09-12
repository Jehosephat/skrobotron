import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScoreboardState {
  score: number;
  timer: number;
  history: { score: number; timer: number }[];
}

const initialState: ScoreboardState = {
  score: 0,
  timer: 0,
  history: [],
};

const MAX_HISTORY = 10;

export const scoreboardSlice = createSlice({
  name: 'scoreboard',
  initialState,
  reducers: {
    setScore(state, action: PayloadAction<{ value: number; record?: boolean }>) {
      const { value, record = true } = action.payload;
      if (record) {
        state.history.push({ score: state.score, timer: state.timer });
        if (state.history.length > MAX_HISTORY) {
          state.history.shift();
        }
      }
      state.score = value;
    },
    setTimer(state, action: PayloadAction<{ value: number; record?: boolean }>) {
      const { value, record = true } = action.payload;
      if (record) {
        state.history.push({ score: state.score, timer: state.timer });
        if (state.history.length > MAX_HISTORY) {
          state.history.shift();
        }
      }
      state.timer = value;
    },
    undo(state) {
      const prev = state.history.pop();
      if (prev) {
        state.score = prev.score;
        state.timer = prev.timer;
      }
    },
    reset(state) {
      state.score = 0;
      state.timer = 0;
      state.history = [];
    },
  },
});

export const { setScore, setTimer, undo, reset } = scoreboardSlice.actions;

export default scoreboardSlice.reducer;
