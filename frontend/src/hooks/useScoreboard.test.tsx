import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { reset } from '../store/scoreboardSlice';
import useScoreboard from './useScoreboard';

const emit = jest.fn();
const on = jest.fn();
const disconnect = jest.fn();

jest.mock('socket.io-client', () => ({
  io: () => ({ emit, on, disconnect }),
}));

beforeEach(() => {
  store.dispatch(reset());
  emit.mockClear();
});

test('updateScore emits scoreUpdate', () => {
  const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
  const { result } = renderHook(() => useScoreboard('sess'), { wrapper });
  act(() => result.current.updateScore(5));
  expect(emit).toHaveBeenCalledWith('scoreUpdate', { sessionId: 'sess', score: 5 });
  expect(store.getState().scoreboard.score).toBe(5);
});
