import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecuperarSenha from './pages/RecuperarSenha';
import ComplaintDetails from './pages/ComplaintDetails';
import MapaReclamacoes from './pages/MapaReclamacoes.tsx';
import Relatorio from './pages/Relatorio';
import Cadastro from './pages/Cadastro.tsx';
import Login from './pages/Login.tsx';


function App() {
  return (
    <div style={{ all: 'initial' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login  />} />
          <Route path="/cadastro" element={<Cadastro  />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/reclamacao" element={<ComplaintDetails />} />
          <Route path="/mapa-reclamacao" element={<MapaReclamacoes  />} />
          <Route path="/relatorio" element={<Relatorio  />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
