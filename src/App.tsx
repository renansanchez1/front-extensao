import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecuperarSenha from './pages/RecuperarSenha';
import ComplaintDetails from './pages/ComplaintDetails';

function App() {
  return (
    <div style={{ all: 'initial' }}>
      <Router>
        <Routes>
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/reclamacao" element={<ComplaintDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
