import React from "react";
import "../styles/Footer.css"; 
import Logo from '../assets/logo_extensao.png';

const Footer: React.FC = () => {
  return (
    <footer className="rodape">
      <img src={Logo} alt="Prefeitura de Ponta Porã" />
    </footer>
  );
};

export default Footer;
