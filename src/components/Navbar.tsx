import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import UserIcon from "../assets/usuario_icone.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topo">
      <div className="logo"></div>

      <nav className="menu">
        <Link
          to="/mapa-reclamacao"
          className={location.pathname === "/mapa-reclamacao" ? "ativo" : ""}
        >
          Mapa
        </Link>
        <Link
          to="/reclamacao"
          className={location.pathname === "/reclamacao" ? "ativo" : ""}
        >
          Reclamações
        </Link>
        <Link
          to="/relatorio"
          className={location.pathname === "/relatorio" ? "ativo" : ""}
        >
          Relatórios
        </Link>
      </nav>

      <div className="usuario" ref={dropdownRef}>
        <div className="usuario-toggle" onClick={() => setOpen(!open)}>
          <img src={UserIcon} alt="Usuário" />
          <span>Meu Perfil</span>
        </div>

        {open && (
          <div className="dropdown">
            <Link to="/perfil">Perfil</Link>
            <a href="/logout">Sair</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
