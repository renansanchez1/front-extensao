import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../styles/ComplaintDetails.css';

interface Solicitacao {
  id: number;
  data_inicio: string;
  data_fim: string;
  detalhes: string;
  status: string;
  tipo_problema: string;
  problema: string;
  cep: string;
  bairro: string;
  rua: string;
  numero: number;
}

const ComplaintDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/solicitacoes/${id}`)
        .then(res => res.json())
        .then(data => setSolicitacao(data))
        .catch(err => console.error('Erro ao buscar solicitação:', err));
    }
  }, [id]);

  if (!solicitacao) return <div>Carregando reclamação...</div>;

  const localFormatado = `${solicitacao.rua}, ${solicitacao.numero}\n${solicitacao.bairro}\n${solicitacao.cep}`;

  const atualizarStatus = () => {
    fetch(`http://localhost:8080/solicitacoes/${solicitacao.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solicitacao),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status');
        alert('Status atualizado com sucesso!');
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao atualizar status');
      });
  };

  return (
    <div className="complaint-page">
      <header className="complaint-header">
        <div className="complaint-logo" />
        <nav className="complaint-nav">
          <a href="#">Mapa</a>
          <a href="#">Reclamações</a>
          <a href="#">Relatórios</a>
        </nav>
        <div className="complaint-user">
          <FaUser size={22} color="#007bc1" />
          <a href="#">Sair</a>
        </div>
      </header>

      <main className="complaint-main">
        <hr className="section-divider" />
        <div className="complaint-grid">
          <div className="form-section">
            <p className="complaint-timestamp">{solicitacao.data_inicio}</p>

            <label>Tipo de problema</label>
            <input type="text" value={solicitacao.tipo_problema} readOnly />

            <label>Local</label>
            <textarea
              className="input-local textarea-local"
              value={localFormatado}
              readOnly
            />

            <label>Detalhes</label>
            <textarea value={solicitacao.problema} readOnly />
          </div>

          <div className="photo-section">
            <div className="complaint-status">
              <label>Status</label>
              <select
                value={solicitacao.status}
                onChange={(e) =>
                  setSolicitacao({ ...solicitacao, status: e.target.value })
                }
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
                <option value="CONCLUIDO">CONCLUIDO</option>
              </select>

              <button onClick={atualizarStatus} style={{ marginTop: '10px' }}>
                Atualizar status
              </button>
            </div>

            <label>Foto</label>
            <div className="photo-placeholder" />
            <div className="photo-placeholder" />
          </div>
        </div>
      </main>

      <footer className="complaint-footer">
        <hr className="footer-divider" />
        <div className="footer-logo" />
      </footer>
    </div>
  );
};

export default ComplaintDetails;
