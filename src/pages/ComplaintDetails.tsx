import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ComplaintDetails.css';

interface Solicitacao {
  id: number;
  data_inicio: string;
  data_fim: string | null;
  detalhes: string;
  status: string;
  tipo_problema: string;
  problema: string;
  cep: string;
  bairro: string;
  rua: string;
  numero: number;
}

interface Media {
  id: number;
  nomeOriginalArquivo: string;
  nomeArquivoArmazenado: string;
  tipoConteudo: string;
  caminhoRelativo: string;
  urlAcesso: string;  
}

const ComplaintDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [midias, setMidias] = useState<Media[]>([]);

  useEffect(() => {
    if (id) {
      // Busca a solicitação
      fetch(`http://localhost:8080/solicitacoes/${id}`)
        .then(res => res.json())
        .then(data => setSolicitacao(data))
        .catch(err => console.error('Erro ao buscar solicitação:', err));

      // Busca as mídias vinculadas à solicitação
      fetch(`http://localhost:8080/api/midias/solicitacao/${id}`)
        .then(res => res.json())
        .then(data => setMidias(data))
        .catch(err => console.error('Erro ao buscar mídias:', err));
    }
  }, [id]);

  if (!solicitacao) return <div>Carregando reclamação...</div>;

  const localFormatado = `${solicitacao.rua}, ${solicitacao.numero}\n${solicitacao.bairro}\n${solicitacao.cep}`;

  const formatarData = (data: string | null): string | null => {
    if (!data) return null;
    const d = new Date(data);
    return d.toISOString().split('T')[0];
  };

  const atualizarStatus = () => {
    if (!solicitacao) return;

    const solicitacaoDTO = {
      data_inicio: formatarData(solicitacao.data_inicio),
      data_fim: solicitacao.data_fim ? formatarData(solicitacao.data_fim) : null,
      detalhes: solicitacao.detalhes,
      status: solicitacao.status,
      tipo_problema: solicitacao.tipo_problema,
      problema: solicitacao.problema,
      cep: solicitacao.cep,
      bairro: solicitacao.bairro,
      rua: solicitacao.rua,
      numero: solicitacao.numero,
    };

    fetch(`http://localhost:8080/solicitacoes/${solicitacao.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solicitacaoDTO),
    })
      .then(async res => {
        if (!res.ok) {
          const erro = await res.text();
          throw new Error(`Erro ao atualizar status: ${erro}`);
        }
        alert('Status atualizado com sucesso!');
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao atualizar status');
      });
  };

  return (
    <div className="complaint-page">
      <Navbar />

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
              <div className="status-container">
                <select
                  className={`status-select ${solicitacao.status.toLowerCase()}`}
                  value={solicitacao.status}
                  onChange={(e) =>
                    setSolicitacao({ ...solicitacao, status: e.target.value })
                  }
                >
                  <option value="NOVO">NOVO</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="CONCLUIDO">CONCLUIDO</option>
                </select>

                <button className="btn-atualizar" onClick={atualizarStatus}>
                  Atualizar status
                </button>
              </div>
            </div>

            <label>Mídias</label>
            <div
              className={`media-gallery ${
                midias.length === 1
                  ? "one"
                  : midias.length === 2
                  ? "two"
                  : midias.length >= 3
                  ? "three"
                  : ""
              }`}
            >
              {midias.length === 0 && <p>Nenhuma mídia anexada.</p>}

              {midias.map((midia) => {
                const url = midia.urlAcesso;

                if (midia.tipoConteudo.startsWith("image/")) {
                  return (
                    <div key={midia.id} style={{ textAlign: "center" }}>
                      <img
                        src={url}
                        alt={midia.nomeOriginalArquivo}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <p style={{ marginTop: "8px" }}>{midia.nomeOriginalArquivo}</p>
                    </div>
                  );
                }

                if (midia.tipoConteudo.startsWith("video/")) {
                  return (
                    <div key={midia.id} style={{ textAlign: "center" }}>
                      <video
                        controls
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          objectFit: "cover",
                        }}
                      >
                        <source src={url} type={midia.tipoConteudo} />
                        Seu navegador não suporta vídeo.
                      </video>
                      <p style={{ marginTop: "8px" }}>{midia.nomeOriginalArquivo}</p>
                    </div>
                  );
                }

                return (
                  <div key={midia.id} style={{ textAlign: "center" }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {midia.nomeOriginalArquivo}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComplaintDetails;
