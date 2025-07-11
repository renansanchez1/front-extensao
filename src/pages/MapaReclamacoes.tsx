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
              setCoordenadas(prev => ({ ...prev, [s.id]: { lat: parseFloat(lat), lng: parseFloat(lon) } }));
            }
          } catch (err) {
            console.error(`Erro ao geocodificar: ${endereco}`, err);
          }
        });
      });
  }, []);

  return (
    <MapContainer center={[-15.78, -47.93]} zoom={5} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {solicitacoes.map((s) => {
        const coord = coordenadas[s.id];
        return coord ? (
          <Marker key={s.id} position={coord}>
            <Popup>
              <strong>Problema:</strong> {s.problema}<br />
              <strong>Endereço:</strong> {s.rua}, {s.numero}, {s.bairro}
            </Popup>
          </Marker>
        ) : null;
      })}
    </MapContainer>
  );
};

export default MapaReclamacoes;
