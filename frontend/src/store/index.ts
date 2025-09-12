import { configureStore } from '@reduxjs/toolkit';
import scoreboardReducer from './scoreboardSlice';
import eventsReducer from './eventsSlice';

export const store = configureStore({
  reducer: {
    scoreboard: scoreboardReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
