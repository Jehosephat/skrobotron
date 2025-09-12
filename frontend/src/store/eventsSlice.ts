import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Event = {
  timestamp: number;
  type: 'score' | 'foul' | 'clock';
  value: number | string;
};

const initialState: Event[] = [];

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    logScoreChange(state, action: PayloadAction<number>) {
      state.push({ timestamp: Date.now(), type: 'score', value: action.payload });
    },
    logFoul(state, action: PayloadAction<string>) {
      state.push({ timestamp: Date.now(), type: 'foul', value: action.payload });
    },
    logClockAction(state, action: PayloadAction<number>) {
      state.push({ timestamp: Date.now(), type: 'clock', value: action.payload });
    },
    clearEvents() {
      return [];
    },
  },
});

export const { logScoreChange, logFoul, logClockAction, clearEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
