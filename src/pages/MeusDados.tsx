// src/pages/MeusDados.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/MeusDados.css';

interface UserData {
  nome: string;
  registro: string;
  email: string;
  senha?: string;
}

const MeusDados: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    registro: '',
    email: '',
    senha: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const fetchedUser = response.data;
      
      setUserData({
        nome: fetchedUser.name, 
        registro: fetchedUser.cpf, 
        email: fetchedUser.email, 
        senha: '',
      });

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      localStorage.removeItem('token');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    fetchUserData();
    setIsEditing(false);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dataToUpdate: any = {
      nome: userData.nome,
      registro: userData.registro,
      email: userData.email,
    };
    if (userData.senha) {
      dataToUpdate.senha = userData.senha;
    }
    try {
      await axios.put('http://localhost:8080/usuario/atualizar', dataToUpdate, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Dados salvos com sucesso!');
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="form-container">
          <h2 className="form-title">Meus Dados</h2>
          <form onSubmit={handleSave} className="data-form">
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input type="text" id="nome" name="nome" value={userData.nome} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="form-group">
              <label htmlFor="registro">Registro administrativo</label>
              <input type="text" id="registro" name="registro" value={userData.registro} onChange={handleChange} disabled={true} />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Nova Senha</label>
              <input type="password" id="senha" name="senha" value={userData.senha} onChange={handleChange} disabled={!isEditing} placeholder={isEditing ? 'Deixe em branco para não alterar' : '********'} />
            </div>
            {!isEditing ? (
              <button type="button" onClick={handleEdit} className="edit-button">EDITAR</button>
            ) : (
              <div className="button-group">
                <button type="submit" className="save-button">SALVAR</button>
                <button type="button" onClick={handleCancel} className="cancel-button">CANCELAR</button>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeusDados;