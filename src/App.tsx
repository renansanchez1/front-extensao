import React from 'react';
import MapaReclamacoes from './pages/MapaReclamacoes';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <nav style={{ backgroundColor: '#333', color: '#fff', padding: '1rem' }}>
        <h2>Reclamações Urbanas</h2>
      </nav>

      <div style={{ flex: 1 }}>
        <MapaReclamacoes />
      </div>

      <footer style={{ backgroundColor: '#eee', padding: '1rem', textAlign: 'center' }}>
        <p>&copy; 2025 Prefeitura Ponta-Porã</p>
      </footer>
    </div>
  );
}

export default App;
