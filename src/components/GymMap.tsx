import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { Gym } from '../types';

type GymMapProps = {
  gyms: Gym[];
  selectedGymId: string | null;
  onSelect: (gymId: string) => void;
};

const DEFAULT_CENTER: [number, number] = [20, 0];

export function GymMap({ gyms, selectedGymId, onSelect }: GymMapProps) {
  return (
    <section className="panel map-panel" aria-label="Gym map">
      <div className="panel-header">
        <h2>Map</h2>
        <span>{selectedGymId ? `Selected: ${selectedGymId}` : 'No selection'}</span>
      </div>
      <div className="panel-body">
        <div className="map-root">
          <MapContainer center={DEFAULT_CENTER} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                position={[gym.latitude, gym.longitude]}
                eventHandlers={{
                  click: () => onSelect(gym.id),
                }}
              >
                <Popup>
                  <strong>{gym.name}</strong>
                  <br />
                  {gym.city}, {gym.country}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
