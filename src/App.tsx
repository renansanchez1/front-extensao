// src/App.tsx (VERSÃO ATUALIZADA)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecuperarSenha from './pages/RecuperarSenha';
import ComplaintDetails from './pages/ComplaintDetails';
import MapaReclamacoes from './pages/MapaReclamacoes.tsx';
import Relatorio from './pages/Relatorio';
import Cadastro from './pages/Cadastro.tsx';
import Login from './pages/Login.tsx';
import MeusDados from './pages/MeusDados.tsx'; // <-- 1. Importe o componente

function App() {
  return (
    <div style={{ all: 'initial' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/reclamacao" element={<ComplaintDetails />} />
          <Route path="/mapa-reclamacao" element={<MapaReclamacoes />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/meus-dados" element={<MeusDados />} /> {/* <-- 2. Adicione a nova rota */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;