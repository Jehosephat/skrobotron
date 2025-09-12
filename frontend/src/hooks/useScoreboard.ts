import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../store';
import { setScore, setTimer, undo as undoAction, reset as resetAction } from '../store/scoreboardSlice';

interface ScoreboardHook {
  score: number;
  timer: number;
  updateScore: (value: number) => void;
  updateTimer: (value: number) => void;
  undo: () => void;
  reset: () => void;
}

export function useScoreboard(sessionId: string): ScoreboardHook {
  const dispatch = useDispatch();
  const { score, timer } = useSelector((state: RootState) => state.scoreboard);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;
    socket.emit('joinSession', sessionId);

    socket.on('scoreUpdate', (value: number) => dispatch(setScore({ value, record: false })));
    socket.on('timerUpdate', (value: number) => dispatch(setTimer({ value, record: false })));
    socket.on('reset', () => dispatch(resetAction()));

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const updateScore = (value: number) => {
    dispatch(setScore({ value }));
    socketRef.current?.emit('scoreUpdate', { sessionId, score: value });
  };

  const updateTimer = (value: number) => {
    dispatch(setTimer({ value }));
    socketRef.current?.emit('timerUpdate', { sessionId, timer: value });
  };

  const undo = () => {
    dispatch(undoAction());
    const { score: s, timer: t } = store.getState().scoreboard;
    socketRef.current?.emit('scoreUpdate', { sessionId, score: s });
    socketRef.current?.emit('timerUpdate', { sessionId, timer: t });
  };

  const reset = () => {
    dispatch(resetAction());
    socketRef.current?.emit('reset', { sessionId });
  };

  return { score, timer, updateScore, updateTimer, undo, reset };
}

export default useScoreboard;
