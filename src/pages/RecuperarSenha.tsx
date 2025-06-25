import React, { useState } from 'react';
import RecuperarLayout from '../components/RecuperarLayout';
import styles from '../styles/RecuperarSenha.module.css';

const RecuperarSenha: React.FC = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica de envio aqui
    console.log(form);
  };

  return (
    <RecuperarLayout title="Recuperar Senha">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Informe o seu Registro Administrativo</label>
          <input
            className={styles.input}
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={form.nome}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Informe o e-mail de cadastro</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nova senha</label>
          <input
            className={styles.input}
            type="password"
            name="novaSenha"
            placeholder="Nova senha"
            value={form.novaSenha}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Confirmar a nova senha</label>
          <input
            className={styles.input}
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar nova senha"
            value={form.confirmarSenha}
            onChange={handleChange}
          />
        </div>

        <button className={styles.button} type="submit">
          RECUPERAR SENHA
        </button>
      </form>
    </RecuperarLayout>
  );
};

export default RecuperarSenha;
