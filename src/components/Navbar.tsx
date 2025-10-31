// src/components/Navbar.tsx (VERSÃO ATUALIZADA)

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; 
import UserIcon from '../assets/usuario_icone.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpa o token de autenticação
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <header className="topo">
      <div className="logo"></div>
      <nav className="menu">
        <Link to="/mapa-reclamacao" className={location.pathname === "/mapa-reclamacao" ? "ativo" : ""}>
          Mapa
        </Link>
        <Link to="/#" className={location.pathname === "/reclamacao" ? "ativo" : ""}>
          Reclamações
        </Link>
        <Link to="/relatorio" className={location.pathname === "/relatorio" ? "ativo" : ""}>
          Relatórios
        </Link>
      </nav>
      <div className="usuario">
        {/* Link para a página Meus Dados */}
        <Link to="/meus-dados">
          <img src={UserIcon} alt="Meus Dados" />
        </Link>
        {/* Botão de Sair com a lógica de logout */}
        <a href="#" onClick={handleLogout}>Sair</a>
      </div>
    </header>
  );
};

export default Navbar;