import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Config } from './pages/Config';
import { Control } from './pages/Control';
import { Display } from './pages/Display';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/config" element={<Config />} />
      <Route path="/control/:sessionId" element={<Control />} />
      <Route path="/display/:sessionId" element={<Display />} />
    </Routes>
  );
}
