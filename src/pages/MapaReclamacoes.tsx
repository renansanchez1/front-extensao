import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import '../styles/MapaReclamacoes.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AlertaIcone from '../assets/alerta_icone.png';

const meuIcone = new L.Icon({
  iconUrl: AlertaIcone, 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

type MediaResponseDTO = {
  id: number;
  url: string;
  tipo: string;
};

type Solicitacao = {
  id: number;
  rua: string;
  numero: number;
  bairro: string;
  cep: string;
  problema: string;
  status: string;
  tipo_problema: string;
  detalhes: string;
  data_inicio: string;
  data_fim: string;
  midias: MediaResponseDTO[];
};

type Localizacao = {
  lat: number;
  lng: number;
};

const MapaReclamacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [coordenadas, setCoordenadas] = useState<Record<number, Localizacao>>({});
  const [filtroStatus, setFiltroStatus] = useState<string>('');

  useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        const res = await axios.get<Solicitacao[]>('http://localhost:8080/solicitacoes');
        setSolicitacoes(res.data);

        const promises = res.data.map(async (s) => {
          const endereco = `${s.rua}, ${s.numero}, ${s.bairro}, ${s.cep}`;
          try {
            const geo = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: { q: endereco, format: 'json' },
            });
            if (geo.data.length > 0) {
              const { lat, lon } = geo.data[0];
              return { id: s.id, lat: parseFloat(lat), lng: parseFloat(lon) };
            }
          } catch (err) {
            console.error(`Erro ao geocodificar: ${endereco}`, err);
          }
          return null;
        });

        const coords = await Promise.all(promises);
        const coordsObj: Record<number, Localizacao> = {};
        coords.forEach(c => { if (c) coordsObj[c.id] = { lat: c.lat, lng: c.lng }; });
        setCoordenadas(coordsObj);

      } catch (error) {
        console.error("Erro ao carregar solicitações", error);
      }
    };

    carregarSolicitacoes();
  }, []);

  const solicitacoesFiltradas = filtroStatus
    ? solicitacoes.filter(s => s.status === filtroStatus)
    : solicitacoes;

  return (
    <div className="pagina-mapa">
      <Navbar />

      <div className="conteudo">
        <div className="filtro">
          <label htmlFor="filtro">Filtrar por status:</label>
          <select id="filtro" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="ABERTO">ABERTO</option> case sensitive
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="RESOLVIDO">Resolvido</option>
          </select>
        </div>

        <div className="principal">
          <aside className="lista-reclamacoes">
            <h3>Reclamações</h3>
            <ul>
              {solicitacoesFiltradas.map((s) => (
                <li key={s.id} className="item-reclamacao">
                  <span className="icone-alerta">⚠️</span>
                  <div className="info">
                    <p className="data">{new Date(s.data_inicio).toLocaleString()}</p>
                    <p><strong>Problema:</strong> {s.tipo_problema}</p>
                    <p><strong>Status:</strong> {s.status}</p>

                    <a href={`/reclamacao?id=${s.id}`} className="btn-detalhes">
                      Ver detalhes
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <div className="mapa-container">
            <MapContainer
              center={[-22.5297, -55.7208]}
              zoom={14}
              style={{ height: '500px', width: '100%' }}
            >
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
      </div>

      <Footer />
    </div>
  );
};

export default MapaReclamacoes;
