import { configureStore } from '@reduxjs/toolkit';
import scoreboardReducer from './scoreboardSlice';

export const store = configureStore({
  reducer: {
    scoreboard: scoreboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
