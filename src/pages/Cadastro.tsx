import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Cadastro.css'; // importa o css específico

const Cadastro: React.FC = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    cpf: '',
    email: '',
    login: '',
    password: '',
    confirmarSenha: '',
  });

  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usuario.password !== usuario.confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post('/usuario/salvar', usuario);
      setMensagem('Cadastro realizado com sucesso!');
      setUsuario({
        nome: '',
        cpf: '',
        email: '',
        login: '',
        password: '',
        confirmarSenha: '',
      });
    } catch (error) {
      setMensagem('Erro ao realizar o cadastro. Verifique os dados.');
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-box">
        <h2>Faça o seu cadastro</h2>

        {mensagem && <div className="alert">{mensagem}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={usuario.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              name="cpf"
              placeholder="CPF/Registro Administrativo"
              value={usuario.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="E-mail"
              value={usuario.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              name="login"
              placeholder="Login"
              value={usuario.login}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Senha"
              value={usuario.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={usuario.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <input className="btn btn-primary" type="submit" value="Cadastrar" />

          <div className="divisao"></div>
        </form>

        <div className="links">
          <Link to="/login">Realizar login</Link>
          <Link to="/recuperar-senha">Recuperar a senha</Link>
        </div>

        <img src="/img/ponta05.png" alt="Logo" className="logo-img" />
      </div>
    </div>
  );
};

export default Cadastro;
