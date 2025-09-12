import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SessionResponse {
  controlUrl: string;
  displayUrl: string;
  qrCodeData: string;
}

export function Config() {
  const { state } = useLocation();
  const sport = (state as { sport?: string })?.sport || 'Unknown';

  const [periods, setPeriods] = useState('');
  const [timer, setTimer] = useState('');
  const [counter, setCounter] = useState('');
  const [session, setSession] = useState<SessionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport, periods, timer, counter }),
    });
    const data = (await response.json()) as SessionResponse;
    setSession(data);
  };

  return (
    <div>
      <h1>Configure {sport}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Periods
            <input
              type="number"
              value={periods}
              onChange={(e) => setPeriods(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Timer (seconds)
            <input
              type="number"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Counters
            <input
              type="number"
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
      {session && (
        <div>
          <p>
            Control: <a href={session.controlUrl}>{session.controlUrl}</a>
          </p>
          <p>
            Display: <a href={session.displayUrl}>{session.displayUrl}</a>
          </p>
          <img src={session.qrCodeData} alt="Display QR Code" />
        </div>
      )}
    </div>
  );
}

export default Config;
