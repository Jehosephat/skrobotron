import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function Config() {
  const { state } = useLocation();
  const sport = (state as { sport?: string })?.sport || 'Unknown';

  const [periods, setPeriods] = useState('');
  const [timer, setTimer] = useState('');
  const [counter, setCounter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for configuration submission
    console.log({ sport, periods, timer, counter });
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
    </div>
  );
}

export default Config;
