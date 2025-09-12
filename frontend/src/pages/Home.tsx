import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sports = ['Soccer', 'Basketball', 'Baseball', 'Hockey'];

export function Home() {
  const navigate = useNavigate();
  const [sport, setSport] = useState(sports[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/config', { state: { sport } });
  };

  return (
    <div>
      <h1>Select a Sport</h1>
      <form onSubmit={handleSubmit}>
        <select value={sport} onChange={(e) => setSport(e.target.value)}>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Configure</button>
      </form>
    </div>
  );
}

export default Home;
