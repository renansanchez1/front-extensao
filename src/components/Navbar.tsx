import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="topo">
      <div className="logo"></div>
      <nav className="menu">
        <a href="#">Mapa</a>
        <a href="#">Reclamações</a>
        <a href="#" className="ativo">Relatórios</a>
      </nav>
      <div className="usuario">
        <img src="/icons/usuario_icone.png" alt="Ícone usuário" />
        <a href="#">Sair</a>
      </div>
    </header>
  );
};

export default Navbar;
