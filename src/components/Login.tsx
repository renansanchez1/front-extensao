import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Login enviado:', form);
    //requisição para API Spring
  };

  return (
    <div className="login-box">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            id="username"
            name="username"
            placeholder="Registro administrativo"
            value={form.username}
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
