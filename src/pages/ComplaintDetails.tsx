import React from 'react';
import '../styles/ComplaintDetails.css';

const ComplaintDetails: React.FC = () => {
  return (
    <div className="complaint-page">
      <header className="complaint-header">
        <div className="complaint-logo" />
        <nav className="complaint-nav">
          <a href="#">Mapa</a>
          <a href="#">Reclamações</a>
          <a href="#">Relatórios</a>
        </nav>
        <div className="complaint-user">
          <span className="user-icon">👤</span>
          <a href="#">Sair</a>
        </div>
      </header>

      <main className="complaint-main">
        <p className="complaint-timestamp">25-02-2025-19-44-50</p>
        <div className="complaint-status">
          <input type="checkbox" id="pending" />
          <label htmlFor="pending" className="pending-label">pendente</label>
        </div>

        <hr />

        <div className="complaint-grid">
          <div className="form-section">
            <label>Tipo de problema</label>
            <input type="text" placeholder="Asfalto" />

            <label>Local</label>
            <input type="text" placeholder="Rua Teste, 100&#10;Bairro&#10;790000-000" />

            <label>Detalhes</label>
            <textarea placeholder="Digite aqui o problema."></textarea>
          </div>

          <div className="photo-section">
            <label>Foto</label>
            <div className="photo-placeholder" />
            <div className="photo-placeholder" />
          </div>
        </div>
      </main>

      <footer className="complaint-footer">
        <div className="footer-logo"></div>
      </footer>
    </div>
  );
};

export default ComplaintDetails;
