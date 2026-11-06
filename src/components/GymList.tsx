import type { Gym } from '../types';
import { formatCurrencyFromCents, formatNumber } from '../utils/format';

type GymListProps = {
  gyms: Gym[];
  selectedGymId: string | null;
  onSelect: (gymId: string) => void;
};

export function GymList({ gyms, selectedGymId, onSelect }: GymListProps) {
  return (
    <section className="panel" aria-label="Gym list">
      <div className="panel-header">
        <h2>Gyms</h2>
        <span>{gyms.length}</span>
      </div>
      <p className="filters-placeholder">
        Filters are intentionally missing. Add filtering that helps an operator find useful gyms.
      </p>
      <div className="panel-body" style={{ padding: 0 }}>
        <ul className="gym-list">
          {gyms.map((gym) => (
            <li key={gym.id}>
              <button
                type="button"
                className="gym-list-item"
                aria-current={selectedGymId === gym.id ? 'true' : undefined}
                onClick={() => onSelect(gym.id)}
              >
                <strong>{gym.name}</strong>
                <span>
                  {gym.city}, {gym.country} · {formatNumber(gym.bookings_count)} bookings ·{' '}
                  {formatCurrencyFromCents(gym.revenue_cents)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
