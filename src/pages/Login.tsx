// src/pages/Login.tsx

import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

interface LoginForm {
  cpf: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ cpf: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const responseText = await response.text();
        let token: string | null = null;

        try {
          const data = JSON.parse(responseText);
          if (data && data.token) {
            token = data.token;
          }
        } catch (jsonError) {
          token = responseText;
        }

        if (token) {
          localStorage.setItem('token', token);
          alert('Login feito com sucesso!');
          navigate('/mapa-reclamacao');
        } else {
          alert('Login falhou: Resposta inesperada do servidor.');
        }

      } else {
        const errorMsg = await response.text();
        alert('Login falhou: ' + errorMsg);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              id="cpf"
              name="cpf"
              placeholder="Seu CPF ou Registro"
              value={form.cpf}
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
            <a href="/recuperar-senha">Recuperar a senha</a>
          </div>

          <input className="btn btn-primary" type="submit" value="Entrar" />
          <div className="divisao"></div>
        </form>

        <img src="/img/ponta05.png" alt="Logo" className="logo-img" />
      </div>
    </div>
  );
};

export default Login;