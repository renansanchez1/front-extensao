import React from 'react';
import styles from '../styles/RecuperarSenha.module.css';

interface Props {
  title: string;
  children: React.ReactNode;
}

const RecuperarLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo} />
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.formContainer}>
        {children}
      </div>

      <div className={styles.footerLine} />
      <img
        src="/img/ponta05.png"
        alt="Prefeitura"
        className={styles.footerImage}
      />
    </div>
  );
};

export default RecuperarLayout;
