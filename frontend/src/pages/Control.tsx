import React from 'react';
import { useParams } from 'react-router-dom';
import { useScoreboard } from '../hooks/useScoreboard';

export function Control() {
  const { sessionId } = useParams();
  const { score, timer, updateScore, updateTimer } = useScoreboard(sessionId!);

  return (
    <div>
      <h1>Control</h1>
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
    </div>
  );
}

export default Control;
