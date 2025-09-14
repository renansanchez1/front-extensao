import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import '../styles/Relatorio.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Solicitacao = {
  id: number;
  tipo_problema: string;
  status: string;
  data_inicio: string;
};

const Relatorios: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [dados, setDados] = useState<any[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    axios.get<Solicitacao[]>('http://localhost:8080/solicitacoes')
      .then(res => setSolicitacoes(res.data))
      .catch(err => console.error("Erro ao carregar solicitações", err));
  }, []);

  const gerarRelatorio = () => {
    if (!dataInicio || !dataFim) return;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const filtradas = solicitacoes.filter(s => {
      const data = new Date(s.data_inicio);
      return data >= inicio && data <= fim;
    });

    const agrupado: Record<string, number> = {};
    filtradas.forEach(s => {
      const d = new Date(s.data_inicio);
      const mes = d.toLocaleString('default', { month: 'short' });
      agrupado[mes] = (agrupado[mes] || 0) + 1;
    });

    const dadosGrafico = Object.entries(agrupado).map(([label, quantidade]) => ({
      label,
      quantidade
    }));

    setDados(dadosGrafico);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Reclamações", 20, 20);
    dados.forEach((item, i) => {
      doc.text(`${item.label}: ${item.quantidade}`, 20, 40 + i * 10);
    });
    doc.save("relatorio.pdf");
  };

  return (
    <div className="pagina-relatorios">
      <Navbar />

      <div className="conteudo">
        <div className="filtros">
          <label>Data Início:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          <label>Data Fim:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          <button onClick={gerarRelatorio} className="btn-relatorio">GERAR RELATÓRIO</button>
          <button onClick={downloadPDF} className="btn-pdf">DOWNLOAD PDF</button>
        </div>

        <div className="grafico">
          <h3>Quantidade de Reclamações</h3>
          <LineChart width={1000} height={600} data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quantidade" stroke="#0077cc" />
          </LineChart>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Relatorios;
