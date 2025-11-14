import React, { useEffect, useMemo, useState } from "react";
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
import Select from "react-select";

type Solicitacao = {
  id: number;
  tipo_problema: string;
  status: string;
  data_inicio: string;
  data_fim?: string;
  bairro?: string;
};

type OptionType = { value: string; label: string };

const COLORS = ["#0077cc", "#28a745", "#f9b233", "#6f42c1", "#17a2b8", "#dc3545"];

const Relatorios: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const [dadosMes, setDadosMes] = useState<any[]>([]);
  const [dadosTipo, setDadosTipo] = useState<any[]>([]);
  const [dadosStatus, setDadosStatus] = useState<any[]>([]);
  const [mediaDias, setMediaDias] = useState<number | null>(null);
  const [dadosDiaSemana, setDadosDiaSemana] = useState<any[]>([]);
  const [dadosHistograma, setDadosHistograma] = useState<any[]>([]);
  const [dadosBairros, setDadosBairros] = useState<any[]>([]);

  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<OptionType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OptionType[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<"AND" | "OR">("AND"); // modo avançado
  const [loading, setLoading] = useState<boolean>(false);

  // opções para selects (memoized)
  const availableTipos = useMemo(() => Array.from(new Set(solicitacoes.map(s => s.tipo_problema))).filter(Boolean), [solicitacoes]);
  const availableStatuses = useMemo(() => Array.from(new Set(solicitacoes.map(s => s.status))).filter(Boolean), [solicitacoes]);

  const optionTipos: OptionType[] = availableTipos.map(t => ({ value: t, label: t }));
  const optionStatuses: OptionType[] = availableStatuses.map(s => ({ value: s, label: s }));

  const processFiltered = (filtradas: Solicitacao[]) => {
    const agrupadoMes: Record<string, number> = {};
    filtradas.forEach((s) => {
      try {
        const d = new Date(s.data_inicio);
        const mes = d.toLocaleString("default", { month: "short", year: "numeric" });
        agrupadoMes[mes] = (agrupadoMes[mes] || 0) + 1;
      } catch {}
    });
    setDadosMes(Object.entries(agrupadoMes).map(([label, quantidade]) => ({ label, quantidade })));

    const agrupadoTipo: Record<string, number> = {};
    filtradas.forEach((s) => {
      if (!s.tipo_problema) return;
      agrupadoTipo[s.tipo_problema] = (agrupadoTipo[s.tipo_problema] || 0) + 1;
    });
    setDadosTipo(Object.entries(agrupadoTipo).map(([tipo, qtd]) => ({ tipo, qtd })));

    const agrupadoStatus: Record<string, number> = {};
    filtradas.forEach((s) => {
      if (!s.status) return;
      agrupadoStatus[s.status] = (agrupadoStatus[s.status] || 0) + 1;
    });
    setDadosStatus(Object.entries(agrupadoStatus).map(([status, qtd]) => ({ status, qtd })));

    const bairroCount: Record<string, number> = {};
    filtradas.forEach((s) => {
      if (s.bairro) {
        bairroCount[s.bairro] = (bairroCount[s.bairro] || 0) + 1;
      }
    });
    const topBairros = Object.entries(bairroCount)
      .map(([bairro, count]) => ({ bairro, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setDadosBairros(topBairros);

    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const contagemSemana: Record<string, number> = {};
    filtradas.forEach((s) => {
      try {
        const day = new Date(s.data_inicio).getDay();
        const nome = diasSemana[day];
        contagemSemana[nome] = (contagemSemana[nome] || 0) + 1;
      } catch {}
    });
    setDadosDiaSemana(Object.entries(contagemSemana).map(([dia, ocorrencias]) => ({ dia, ocorrencias })));

    const calcularDias = (i: string, f?: string) => {
      if (!f) return 0;
      const inicio = new Date(i);
      const fim = new Date(f);
      const diff = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 ? Math.round(diff) : 0;
    };
    const tempoFrequencia: Record<number, number> = {};
    filtradas.forEach((s) => {
      const dias = calcularDias(s.data_inicio, s.data_fim);
      tempoFrequencia[dias] = (tempoFrequencia[dias] || 0) + 1;
    });
    setDadosHistograma(Object.entries(tempoFrequencia).map(([dias, qtd]) => ({ dias, qtd })));

    const resolvidas = filtradas.filter((s) => s.data_fim);
    if (resolvidas.length > 0) {
      const totalDias = resolvidas.reduce((acc, s) => {
        try {
          const dtInicio = new Date(s.data_inicio);
          const dtFim = new Date(s.data_fim!);
          const diff = (dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24);
          return acc + diff;
        } catch { return acc; }
      }, 0);
      setMediaDias(totalDias / resolvidas.length);
    } else {
      setMediaDias(null);
    }
  };

  const aplicarFiltros = (useData?: Solicitacao[]) => {
    if (!dataInicio || !dataFim) return;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const base = useData ?? solicitacoes;

    const tiposSelected = new Set(selectedTipo.map(s => s.value));
    const statusSelected = new Set(selectedStatus.map(s => s.value));

    const filtradas = base.filter((s) => {
      try {
        const data = new Date(s.data_inicio);
        const dataValida = data >= inicio && data <= fim;

        const tipoMatch = tiposSelected.size === 0 ? true : tiposSelected.has(s.tipo_problema);
        const statusMatch = statusSelected.size === 0 ? true : statusSelected.has(s.status);

        const combined = filterMode === "AND" ? (tipoMatch && statusMatch) : (tipoMatch || statusMatch);

        return dataValida && combined;
      } catch {
        return false;
      }
    });

    processFiltered(filtradas);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get<Solicitacao[]>("http://localhost:8080/solicitacoes")
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setSolicitacoes(data);

        const today = new Date();
        const fimStr = today.toISOString().split("T")[0];
        const inicioObj = new Date(today);
        inicioObj.setDate(inicioObj.getDate() - 30);
        const inicioStr = inicioObj.toISOString().split("T")[0];

        setDataInicio(inicioStr);
        setDataFim(fimStr);


        setTimeout(() => aplicarFiltros(data), 150);
      })
      .catch((err) => {
        console.error("Erro ao carregar solicitações", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [filterMode]); 

  const gerarRelatorio = () => {
    aplicarFiltros();
  };

  const limparFiltros = () => {
    setSelectedTipo([]);
    setSelectedStatus([]);
    const hoje = new Date();
    const fimStr = hoje.toISOString().split("T")[0];
    const inicioObj = new Date(hoje);
    inicioObj.setDate(inicioObj.getDate() - 30);
    const inicioStr = inicioObj.toISOString().split("T")[0];
    setDataInicio(inicioStr);
    setDataFim(fimStr);

    setTimeout(() => aplicarFiltros(), 50);
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
        {/* FILTROS */}
        <div className="filtros-modernos">
          <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                className="btn-limpar"
                onClick={() => setFiltersOpen(prev => !prev)}
                aria-expanded={filtersOpen}
              >
                {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
              </button>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
   
                <div style={{ marginLeft: 12 }}>
                  <button className="btn-limpar" onClick={limparFiltros}>Limpar filtros</button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={gerarRelatorio} className="btn-filtrar">Gerar</button>
              <button onClick={downloadPDF} className="btn-exportar" disabled={!dadosMes.length}>Exportar PDF</button>
            </div>
          </div>

          {/* painel recolhível */}
          {filtersOpen && (
            <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
              <div className="filtro-item">
                <label>Data Início</label>
                <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </div>

              <div className="filtro-item">
                <label>Data Fim</label>
                <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>

              <div className="filtro-item" style={{ minWidth: 220 }}>
                <label>Tipo</label>
                <Select
                  isMulti
                  options={optionTipos}
                  value={selectedTipo}
                  onChange={(val) => setSelectedTipo(val as OptionType[])}
                  placeholder="Pesquisar tipos..."
                  noOptionsMessage={() => "Nenhum tipo"}
                />
              </div>

              <div className="filtro-item" style={{ minWidth: 220 }}>
                <label>Status</label>
                <Select
                  isMulti
                  options={optionStatuses}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val as OptionType[])}
                  placeholder="Pesquisar status..."
                  noOptionsMessage={() => "Nenhum status"}
                />
              </div>
            </div>
          )}
        </div>

        {/* DASHBOARD */}
        <div id="dashboard" className="dashboard-grid">
          {/* INDICADORES */}
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

          {/* G R Á F I C O S */}
          <div className="linha-graficos">

            {/* Por Mês */}
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

            {/* Por Tipo */}
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

            {/* Por Status */}
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

            {/* Top Bairros */}
            <div className="grafico-container">
              <h3>Top Bairros</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosBairros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bairro" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6f42c1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dia da Semana */}
            <div className="grafico-container">
              <h3>Ocorrências por Dia da Semana</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosDiaSemana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ocorrencias" fill="#17a2b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Histograma de Resolução */}
            <div className="grafico-container">
              <h3>Distribuição do Tempo de Resolução (em dias)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosHistograma}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dias" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="qtd" fill="#dc3545" />
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
