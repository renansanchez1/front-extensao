import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Login enviado:', form);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.text(); 
        console.log('Resposta do backend:', data);
        alert('Login feito com sucesso!');
      } else {
        const errorMsg = await response.text();
        alert('Login falhou: ' + errorMsg);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            id="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="links">
          <Link to="/cadastro">Faça seu cadastro</Link>
          <a href="#">Recuperar a senha</a>
        </div>

        <input className="btn btn-primary" type="submit" value="Entrar" />

        <div className="divisao"></div>
      </form>

      <img src="/img/ponta05.png" alt="Logo" className="logo-img" />
    </div>
  );
};

export default Login;
