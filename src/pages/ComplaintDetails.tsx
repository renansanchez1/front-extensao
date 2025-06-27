import React from 'react';
import '../styles/ComplaintDetails.css';
import { FaUser } from 'react-icons/fa';


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
          <FaUser size={22} color="#007bc1" />
          <a href="#">Sair</a>
        </div>

      </header>

      <main className="complaint-main">
        <hr className="section-divider" />
        <div className="complaint-grid">
          <div className="form-section">
            <p className="complaint-timestamp">25-02-2025-19-44-50</p>

            <label>Tipo de problema</label>
            <input type="text" placeholder="Asfalto" />

            <label>Local</label>
            <textarea
              placeholder={`Rua Teste, 100\nBairro\n79000-000`}
              className="input-local textarea-local"
            />


            <label>Detalhes</label>
            <textarea placeholder="Digite aqui o problema."></textarea>
          </div>

          <div className="photo-section">
            <div className="complaint-status">
              <input type="checkbox" id="pending" />
              <label htmlFor="pending" className="pending-label">pendente</label>
            </div>

            <label>Foto</label>
            <div className="photo-placeholder" />
            <div className="photo-placeholder" />
          </div>
        </div>
      </main>

      <footer className="complaint-footer">
        <hr className="footer-divider" />
        <div className="footer-logo"></div>
      </footer>

    </div>
  );
};

export default ComplaintDetails;
