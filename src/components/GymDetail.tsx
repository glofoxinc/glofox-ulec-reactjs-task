import type { Gym } from '../types';
import {
  formatCurrencyFromCents,
  formatNumber,
  formatPercent,
} from '../utils/format';

type GymDetailProps = {
  gym: Gym | null;
};

export function GymDetail({ gym }: GymDetailProps) {
  return (
    <section className="panel" aria-label="Selected gym">
      <div className="panel-header">
        <h2>Selected gym</h2>
      </div>
      <div className="panel-body">
        {!gym ? (
          <p className="detail-empty">Select a gym from the list or map.</p>
        ) : (
          <dl className="detail-grid">
            <div>
              <dt>Name</dt>
              <dd>{gym.name}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                {gym.city}, {gym.country}
              </dd>
            </div>
            <div>
              <dt>Bookings</dt>
              <dd>{formatNumber(gym.bookings_count)}</dd>
            </div>
            <div>
              <dt>Revenue</dt>
              <dd>{formatCurrencyFromCents(gym.revenue_cents)}</dd>
            </div>
            <div>
              <dt>Members</dt>
              <dd>{formatNumber(gym.member_count)}</dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{formatNumber(gym.capacity)}</dd>
            </div>
            <div>
              <dt>Utilization</dt>
              <dd>{formatPercent(gym.utilization)}</dd>
            </div>
            <div>
              <dt>Average rating</dt>
              <dd>{gym.avg_rating.toFixed(1)}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
