import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './MapaReclamacoes.css';


const meuIcone = new L.Icon({
  iconUrl: '/icons/alerta_icone.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41]
});

type Solicitacao = {
  id: number;
  rua: string;
  numero: number;
  bairro: string;
  cep: string;
  problema: string;
  status: string; // novo campo
};

type Localizacao = {
  lat: number;
  lng: number;
};

const MapaReclamacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [coordenadas, setCoordenadas] = useState<Record<number, Localizacao>>({});
  const [filtroStatus, setFiltroStatus] = useState<string>(''); // novo state

  useEffect(() => {
    axios.get<Solicitacao[]>('http://localhost:8080/solicitacoes')
      .then(res => {
        setSolicitacoes(res.data);
        res.data.forEach(async (s) => {
          const endereco = `${s.rua}, ${s.numero}, ${s.bairro}, ${s.cep}`;
          try {
            const geo = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                q: endereco,
                format: 'json',
              }
            });
            if (geo.data.length > 0) {
              const { lat, lon } = geo.data[0];
              setCoordenadas(prev => ({
                ...prev,
                [s.id]: { lat: parseFloat(lat), lng: parseFloat(lon) }
              }));
            }
          } catch (err) {
            console.error(`Erro ao geocodificar: ${endereco}`, err);
          }
        });
      });
  }, []);

  const solicitacoesFiltradas = filtroStatus
    ? solicitacoes.filter(s => s.status === filtroStatus)
    : solicitacoes;

  return (
    <div className="pagina-mapa">
      <header className="topo">
        <div className="logo"></div>
        <nav className="menu">
          <a href="#" className="ativo">Mapa</a>
          <a href="#">Reclamações</a>
          <a href="#">Relatórios</a>
        </nav>
        <div className="usuario">
          <img src="/icons/usuario_icone.png" alt="Ícone usuário" />
          <a href="#">Sair</a>
        </div>
      </header>

      <div className="conteudo">
        <div className="filtro">
          <label htmlFor="filtro">Filtrar por status:</label>
          <select id="filtro" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="RESOLVIDO">Resolvido</option>
          </select>
        </div>

        <div className="mapa-container">
          <MapContainer center={[-22.5297, -55.7208]} zoom={14} style={{ height: '500px', width: '100%', borderRadius: '16px' }}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {solicitacoesFiltradas.map((s) => {
              const coord = coordenadas[s.id];
              return coord ? (
                <Marker key={s.id} position={coord} icon={meuIcone}>
                  <Popup>
                    <strong>Problema:</strong> {s.problema}<br />
                    <strong>Status:</strong> {s.status}<br />
                    <strong>Endereço:</strong> {s.rua}, {s.numero}, {s.bairro}
                  </Popup>
                </Marker>
              ) : null;
            })}
          </MapContainer>
        </div>
      </div>

      <footer className="rodape">
        <img src="/logo_extensao.png" alt="Prefeitura de Ponta Porã" />
      </footer>
    </div>
  );
};


export default MapaReclamacoes;
