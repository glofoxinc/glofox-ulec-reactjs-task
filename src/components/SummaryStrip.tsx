import type { Gym } from '../types';
import { formatCurrencyFromCents, formatNumber } from '../utils/format';

type SummaryStripProps = {
  gyms: Gym[];
};

export function SummaryStrip({ gyms }: SummaryStripProps) {
  const totalRevenue = gyms.reduce((sum, gym) => sum + gym.revenue_cents, 0);
  const totalBookings = gyms.reduce((sum, gym) => sum + gym.bookings_count, 0);
  const totalMembers = gyms.reduce((sum, gym) => sum + gym.member_count, 0);

  return (
    <section className="summary-strip" aria-label="Summary statistics">
      <article className="summary-card">
        <span>Gyms shown</span>
        <strong>{formatNumber(gyms.length)}</strong>
      </article>
      <article className="summary-card">
        <span>Total bookings</span>
        <strong>{formatNumber(totalBookings)}</strong>
      </article>
      <article className="summary-card">
        <span>Total revenue</span>
        <strong>{formatCurrencyFromCents(totalRevenue)}</strong>
      </article>
      <article className="summary-card">
        <span>Total members</span>
        <strong>{formatNumber(totalMembers)}</strong>
      </article>
    </section>
  );
}
