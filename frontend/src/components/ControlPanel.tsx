import React from 'react';
import { useScoreboard } from '../hooks/useScoreboard';

interface Props {
  sessionId: string;
}

export function ControlPanel({ sessionId }: Props) {
  const { score, timer, updateScore, updateTimer, undo, reset } = useScoreboard(sessionId);

  return (
    <div>
      <div>
        <p>Score: {score}</p>
        <button onClick={() => updateScore(score + 1)}>+1</button>
        <button onClick={() => updateScore(score - 1)}>-1</button>
      </div>
      <div>
        <p>Timer: {timer}</p>
        <button onClick={() => updateTimer(timer + 1)}>+1s</button>
        <button onClick={() => updateTimer(timer - 1)}>-1s</button>
      </div>
      <div>
        <button onClick={undo}>Undo</button>
        <button onClick={reset}>Reset</button>
        <button
          onClick={async () => {
            const res = await fetch(`http://localhost:3000/session/${sessionId}/log`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `session-${sessionId}-log.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
