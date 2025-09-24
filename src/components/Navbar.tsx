import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css"; 
import UserIcon from '../assets/usuario_icone.png';


const Navbar: React.FC = () => {
  const location = useLocation();

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
        <img src={UserIcon} alt="Prefeitura de Ponta Porã" />
        <a href="/">Sair</a>
      </div>
    </header>
  );
};

export default Navbar;
