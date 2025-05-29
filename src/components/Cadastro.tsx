import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('/usuario/salvar', usuario);
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
    <div className="container mt-4">
      <h2>Faça o seu cadastro</h2>

      {mensagem && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <button type="button" className="btn-close" onClick={() => setMensagem(null)}></button>
          <span>{mensagem}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome completo</label>
          <input className="form-control" type="text" name="nome" value={usuario.nome} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">CPF/Registro Administrativo</label>
          <input className="form-control" type="text" name="cpf" value={usuario.cpf} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input className="form-control" type="text" name="email" value={usuario.email} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Login</label>
          <input className="form-control" type="text" name="login" value={usuario.login} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input className="form-control" type="password" name="password" value={usuario.password} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar senha</label>
          <input className="form-control" type="password" name="confirmarSenha" value={usuario.confirmarSenha} onChange={handleChange} />
        </div>

        <input className="btn btn-primary" type="submit" value="Cadastrar" />

        <div className="divisao mt-3"></div>
      </form>

      <div className="links mt-3">
        <Link to="/">Realizar login</Link>
        <br />
        <Link to="#">Recuperar a senha</Link>
      </div>

      <img
        src="/img/ponta05.png"
        alt="Logo"
        className="logo-img mt-4"
        style={{ maxWidth: 200, display: 'block', margin: '40px auto 0' }}
      />
    </div>
  );
};

export default Cadastro;
