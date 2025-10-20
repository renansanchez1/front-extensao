import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Relatorio.css";

type Solicitacao = {
  id: number;
  tipo_problema: string;
  status: string;
  data_inicio: string;
  data_fim?: string;
};

const COLORS = ["#0077cc", "#28a745", "#f9b233", "#6f42c1", "#17a2b8", "#dc3545"];

const Relatorios: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [dadosMes, setDadosMes] = useState<any[]>([]);
  const [dadosTipo, setDadosTipo] = useState<any[]>([]);
  const [dadosStatus, setDadosStatus] = useState<any[]>([]);
  const [mediaDias, setMediaDias] = useState<number | null>(null);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    axios
      .get<Solicitacao[]>("http://localhost:8080/solicitacoes")
      .then((res) => setSolicitacoes(res.data))
      .catch((err) => console.error("Erro ao carregar solicitações", err));
  }, []);

  const availableTipos = Array.from(new Set(solicitacoes.map(s => s.tipo_problema)));
  const availableStatuses = Array.from(new Set(solicitacoes.map(s => s.status)));

  const gerarRelatorio = () => {
    if (!dataInicio || !dataFim) return;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const filtradas = solicitacoes.filter((s) => {
      const data = new Date(s.data_inicio);
      const dataValida = data >= inicio && data <= fim;
      const tipoValido = selectedTipo ? s.tipo_problema === selectedTipo : true;
      const statusValido = selectedStatus ? s.status === selectedStatus : true;
      return dataValida && tipoValido && statusValido;
    });

    const agrupadoMes: Record<string, number> = {};
    filtradas.forEach((s) => {
      const d = new Date(s.data_inicio);
      const mes = d.toLocaleString("default", { month: "short" });
      agrupadoMes[mes] = (agrupadoMes[mes] || 0) + 1;
    });
    setDadosMes(Object.entries(agrupadoMes).map(([label, quantidade]) => ({ label, quantidade })));

    const agrupadoTipo: Record<string, number> = {};
    filtradas.forEach((s) => {
      agrupadoTipo[s.tipo_problema] = (agrupadoTipo[s.tipo_problema] || 0) + 1;
    });
    setDadosTipo(Object.entries(agrupadoTipo).map(([tipo, qtd]) => ({ tipo, qtd })));

    const agrupadoStatus: Record<string, number> = {};
    filtradas.forEach((s) => {
      agrupadoStatus[s.status] = (agrupadoStatus[s.status] || 0) + 1;
    });
    setDadosStatus(Object.entries(agrupadoStatus).map(([status, qtd]) => ({ status, qtd })));

    const resolvidas = filtradas.filter((s) => s.data_fim);
    if (resolvidas.length > 0) {
      const totalDias = resolvidas.reduce((acc, s) => {
        const inicio = new Date(s.data_inicio);
        const fim = new Date(s.data_fim!);
        const diff = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
        return acc + diff;
      }, 0);
      setMediaDias(totalDias / resolvidas.length);
    } else {
      setMediaDias(null);
    }
  };

  const downloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Relatório de Reclamações", 20, 20);
    doc.setFontSize(12);
    doc.text(`Período: ${dataInicio} até ${dataFim}`, 20, 35);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 45);

    const grafico = document.getElementById("dashboard");
    if (grafico) {
      const canvas = await html2canvas(grafico, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 15, 60, imgWidth, imgHeight);
    }

    doc.save("relatorio_completo.pdf");
  };

  const total = dadosMes.reduce((acc, d) => acc + d.quantidade, 0);

  return (
    <div className="pagina-relatorios">
      <Navbar />

      <div className="dashboard-container">
        <div className="filtros-modernos">
          <div className="filtros-esquerda">
            <div className="filtro-item">
              <label>Data Início</label>
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div className="filtro-item">
              <label>Data Fim</label>
              <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
            <div className="filtro-item">
              <label>Tipo</label>
              <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
                <option value="">Todos</option>
                {availableTipos.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div className="filtro-item">
              <label>Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Todos</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="botoes-filtros">
            <button onClick={gerarRelatorio} className="btn-filtrar">Gerar</button>
            <button onClick={downloadPDF} className="btn-exportar" disabled={!dadosMes.length}>Exportar PDF</button>
          </div>
        </div>

        <div id="dashboard" className="dashboard-grid">
          <div className="linha-indicadores">
            <div className="card-indicador">
              <h4>Total de Reclamações</h4>
              <span>{total}</span>
            </div>

            <div className="card-indicador">
              <h4>Média de Dias p/ Resolução</h4>
              <span>{mediaDias ? mediaDias.toFixed(1) : "-"}</span>
            </div>
          </div>

          <div className="linha-graficos">
            <div className="grafico-container">
              <h3>Reclamações por Mês</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dadosMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantidade" stroke="#0077cc" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grafico-container">
              <h3>Reclamações por Tipo</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={dadosTipo} dataKey="qtd" nameKey="tipo" cx="50%" cy="50%" outerRadius={100} label>
                    {dadosTipo.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grafico-container">
              <h3>Reclamações por Status</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qtd" fill="#28a745" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Relatorios;
