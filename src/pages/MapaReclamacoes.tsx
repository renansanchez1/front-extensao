import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const meuIcone = new L.Icon({
  iconUrl: '/icons/marcador_icone.webp',
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
};

type Localizacao = {
  lat: number;
  lng: number;
};

const MapaReclamacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [coordenadas, setCoordenadas] = useState<Record<number, Localizacao>>({});

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
          <i className="icon-user" /> <a href="#">Sair</a>
        </div>
      </header>

      <div className="conteudo">
        <div className="filtro">
          <label htmlFor="filtro">Filtrar por:</label>
          <select id="filtro">
            <option value="">Todos</option>
            {/* Insira filtros dinâmicos conforme necessário */}
          </select>
        </div>

        <div className="mapa-container">
          <MapContainer center={[-22.5297, -55.7208]} zoom={14} style={{ height: '500px', width: '100%', borderRadius: '16px' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {solicitacoes.map((s) => {
              const coord = coordenadas[s.id];
              return coord ? (
                <Marker key={s.id} position={coord} icon={meuIcone}>
                  <Popup>
                    <strong>Problema:</strong> {s.problema}<br />
                    <strong>Endereço:</strong> {s.rua}, {s.numero}, {s.bairro}
                  </Popup>
                </Marker>
              ) : null;
            })}
          </MapContainer>
        </div>
      </div>

      <footer className="rodape">
        <img src="/logo-prefeitura.png" alt="Prefeitura de Ponta Porã" />
      </footer>
    </div>
  );
};

export default MapaReclamacoes;
