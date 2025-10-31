// src/pages/Cadastro.tsx (VERSÃO CORRIGIDA)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import axios from 'axios';
import '../styles/Cadastro.css'; 

const Cadastro: React.FC = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    cpf: '',
    email: '',
    login: '', // O campo login não parece ser usado no backend, mas mantemos no form
    password: '',
    confirmarSenha: '',
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null); // Limpa a mensagem anterior

    if (usuario.password !== usuario.confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    // *** A CORREÇÃO ESTÁ AQUI ***
    // Criamos um objeto apenas com os dados que o backend espera
    // e com os nomes de campos corretos (nome -> name).
    const dadosParaEnviar = {
      name: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      password: usuario.password
    };

    try {
      // Usando a URL correta para o registro
      await axios.post('http://localhost:8080/register', dadosParaEnviar);
      
      setMensagem('Cadastro realizado com sucesso! Redirecionando para o login...');
      
      // Limpa o formulário após o sucesso
      setUsuario({
        nome: '',
        cpf: '',
        email: '',
        login: '',
        password: '',
        confirmarSenha: '',
      });

      // Aguarda 2 segundos e redireciona o usuário para a página de login
      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (error) {
      // Exibe uma mensagem de erro mais útil
      if (axios.isAxiosError(error) && error.response) {
        setMensagem(`Erro: ${error.response.data.message || 'Verifique os dados informados.'}`);
      } else {
        setMensagem('Erro ao realizar o cadastro. Tente novamente.');
      }
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-box">
        <h2>Faça o seu cadastro</h2>

        {/* Mensagem de sucesso ou erro */}
        {mensagem && (
          <div className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-error'}`}>
            {mensagem}
          </div>
        )}

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
              placeholder="Login (opcional)"
              value={usuario.login}
              onChange={handleChange}
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
          <Link to="/">Realizar login</Link>
          <Link to="/recuperar-senha">Recuperar a senha</Link>
        </div>

        <img src="/img/ponta05.png" alt="Logo" className="logo-img" />
      </div>
    </div>
  );
};

export default Cadastro;