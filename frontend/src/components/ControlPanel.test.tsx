import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';

const mockUpdateScore = jest.fn();

jest.mock('../hooks/useScoreboard', () => ({
  useScoreboard: () => ({
    score: 0,
    timer: 0,
    updateScore: mockUpdateScore,
    updateTimer: jest.fn(),
    undo: jest.fn(),
    reset: jest.fn(),
  }),
}));

test('increments score when +1 clicked', () => {
  render(<ControlPanel sessionId="s1" />);
  fireEvent.click(screen.getByText('+1'));
  expect(mockUpdateScore).toHaveBeenCalledWith(1);
});
