import React from 'react';
import { useParams } from 'react-router-dom';
import { ControlPanel } from '../components/ControlPanel';

export function Control() {
  const { sessionId } = useParams();

  return (
    <div>
      <h1>Control</h1>
      {sessionId && <ControlPanel sessionId={sessionId} />}
    </div>
  );
}

export default Control;
