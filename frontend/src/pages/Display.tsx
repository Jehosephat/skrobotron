import React from 'react';
import { useParams } from 'react-router-dom';
import { useScoreboard } from '../hooks/useScoreboard';

export function Display() {
  const { sessionId } = useParams();
  const { score, timer } = useScoreboard(sessionId!);

  return (
    <div>
      <h1>Display</h1>
      <p>Score: {score}</p>
      <p>Timer: {timer}</p>
    </div>
  );
}

export default Display;
