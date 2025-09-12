import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ScoreboardHook {
  score: number;
  timer: number;
  updateScore: (value: number) => void;
  updateTimer: (value: number) => void;
}

export function useScoreboard(sessionId: string): ScoreboardHook {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;
    socket.emit('joinSession', sessionId);

    socket.on('scoreUpdate', (value: number) => setScore(value));
    socket.on('timerUpdate', (value: number) => setTimer(value));

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const updateScore = (value: number) => {
    setScore(value);
    socketRef.current?.emit('scoreUpdate', { sessionId, score: value });
  };

  const updateTimer = (value: number) => {
    setTimer(value);
    socketRef.current?.emit('timerUpdate', { sessionId, timer: value });
  };

  return { score, timer, updateScore, updateTimer };
}

export default useScoreboard;
